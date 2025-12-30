'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getActiveTeams } from '@/actions/team';
import { createTicket, getTicket, updateTicket, uploadOpponentImage } from '@/actions/ticket';
import { Team } from '@/types/team';
import { TicketFormData, Ticket } from '@/types/ticket';
import ImageUpload from './ImageUpload';

interface TicketFormProps {
  ticketId?: string;
}

export default function TicketForm({ ticketId }: TicketFormProps) {
  const router = useRouter();
  const isEditing = Boolean(ticketId);

  // Form state
  const [formData, setFormData] = useState<TicketFormData>({
    matchName: '',
    date: '',
    time: '',
    stadium: '',
    teamId: '',
    opponentName: '',
    externalTicketLink: '',
    description: '',
    sponsor: '',
    opponentImage: '',
  });

  // UI state
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load teams data
        const teamsData = await getActiveTeams();

        setTeams(teamsData);

        // If editing, load the ticket data
        if (isEditing && ticketId) {
          const ticket = await getTicket(ticketId);
          if (ticket) {
            setFormData({
              matchName: ticket.matchName || '',
              date: ticket.date || '',
              time: ticket.time || '',
              stadium: ticket.stadium || '',
              teamId: typeof ticket.teamId === 'object' ? ticket.teamId._id : ticket.teamId || '',
              opponentName: ticket.opponentName || '',
              externalTicketLink: ticket.externalTicketLink || '',
              description: ticket.description || '',
              sponsor: ticket.sponsor || '',
              opponentImage: ticket.opponentImage || '',
            });
          } else {
            toast.error('Ticket not found');
            router.push('/admin/tickets');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticketId, isEditing, router]);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.matchName || !formData.date || !formData.time || !formData.stadium ||
      !formData.teamId || !formData.opponentName || !formData.externalTicketLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditing && ticketId) {
        result = await updateTicket(ticketId, formData);
      } else {
        result = await createTicket(formData);
      }

      if (result.success) {
        toast.success(isEditing ? 'Ticket updated successfully' : 'Ticket created successfully');
        router.push('/admin/tickets');
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Error saving ticket:', error);
      toast.error(error.message || 'An error occurred while saving the ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    // If empty file is passed, it means we want to clear the image
    if (file.size === 0) {
      setFormData(prev => ({ ...prev, opponentImage: '' }));
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadOpponentImage(formData);

      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, opponentImage: result.url || '' }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Ticket' : 'Add New Ticket'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Match Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchName">Match Name *</Label>
                <Input
                  id="matchName"
                  name="matchName"
                  value={formData.matchName}
                  onChange={handleInputChange}
                  placeholder="e.g., Ventura FC vs San Diego Loyal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opponentName">Opponent Name *</Label>
                <Input
                  id="opponentName"
                  name="opponentName"
                  value={formData.opponentName}
                  onChange={handleInputChange}
                  placeholder="e.g., San Diego Loyal"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stadium">Stadium *</Label>
                <Input
                  id="stadium"
                  name="stadium"
                  value={formData.stadium}
                  onChange={handleInputChange}
                  placeholder="e.g., Heart Health Park"
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Team Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamId">Team *</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => handleSelectChange('teamId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Opponent Logo</Label>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  isUploading={imageUploading}
                  imageUrl={formData.opponentImage}
                />
              </div>
            </div>
          </div>

          {/* Ticket Link */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ticket Information</h3>

            <div className="space-y-2">
              <Label htmlFor="externalTicketLink">External Ticket Link *</Label>
              <Input
                id="externalTicketLink"
                name="externalTicketLink"
                value={formData.externalTicketLink}
                onChange={handleInputChange}
                placeholder="https://ticketing-website.com/match-tickets"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Opening Night Match"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsor">Sponsor</Label>
              <Input
                id="sponsor"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleInputChange}
                placeholder="e.g., Western Health Advantage"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/tickets')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C5A464] hover:bg-[#B39355]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Ticket' : 'Create Ticket'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 