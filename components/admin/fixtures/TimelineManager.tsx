"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Save, Clock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { updateFixtureTimeline } from "@/actions/fixture";
import { ITimelineEvent } from "@/models/Fixture";

// Form schema for timeline events
const timelineEventSchema = z.object({
  time: z.string().min(1, "Time is required"),
  type: z.string().min(1, "Event type is required"),
  team: z.string().min(1, "Team is required"),
  player: z.string().optional(),
  assistedBy: z.string().optional(),
  description: z.string().optional(),
});

type TimelineEventFormValues = z.infer<typeof timelineEventSchema>;

interface TimelineManagerProps {
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  initialTimeline?: ITimelineEvent[];
}

export default function TimelineManager({
  fixtureId,
  homeTeam,
  awayTeam,
  initialTimeline = [],
}: TimelineManagerProps) {
  const [timeline, setTimeline] = useState<ITimelineEvent[]>(initialTimeline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<TimelineEventFormValues>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      time: "",
      type: "",
      team: "",
      player: "",
      assistedBy: "",
      description: "",
    },
  });

  // Add a new event to the timeline
  const addEvent = (data: TimelineEventFormValues) => {
    setTimeline((prev) => [...prev, data].sort((a, b) => {
      // Sort by time (convert "45+2" format to minutes)
      const timeA = parseTimeString(a.time);
      const timeB = parseTimeString(b.time);
      return timeA - timeB;
    }));
    
    form.reset();
  };

  // Parse time strings like "45+2" to numeric values for sorting
  const parseTimeString = (timeStr: string): number => {
    if (timeStr.includes("+")) {
      const [minutes, added] = timeStr.split("+").map(Number);
      return minutes + (added / 10); // Use decimal for added time
    }
    return Number(timeStr);
  };

  // Remove an event from the timeline
  const removeEvent = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  // Save the timeline to the database
  const saveTimeline = async () => {
    setIsSubmitting(true);
    
    try {
      await updateFixtureTimeline(fixtureId, timeline);
      toast.success("Timeline updated successfully");
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast.error("Failed to update timeline");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "GOAL":
        return "bg-green-100 text-green-800";
      case "YELLOW_CARD":
        return "bg-yellow-100 text-yellow-800";
      case "RED_CARD":
        return "bg-red-100 text-red-800";
      case "SUBSTITUTION":
        return "bg-[#BD9B58]/20 text-[#BD9B58]";
      case "PENALTY_MISSED":
        return "bg-gray-100 text-gray-800";
      case "OWN_GOAL":
        return "bg-purple-100 text-purple-800";
      case "VAR":
        return "bg-indigo-100 text-indigo-800";
      case "MATCH_START":
      case "HALF_TIME":
      case "MATCH_END":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format event type for display
  const formatEventType = (type: string) => {
    return type.replace(/_/g, " ");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Match Timeline Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addEvent)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (min)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="e.g. 45 or 45+2" {...field} />
                          <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Event Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MATCH_START">Match Start</SelectItem>
                          <SelectItem value="GOAL">Goal</SelectItem>
                          <SelectItem value="OWN_GOAL">Own Goal</SelectItem>
                          <SelectItem value="PENALTY_SCORED">Penalty Scored</SelectItem>
                          <SelectItem value="PENALTY_MISSED">Penalty Missed</SelectItem>
                          <SelectItem value="YELLOW_CARD">Yellow Card</SelectItem>
                          <SelectItem value="RED_CARD">Red Card</SelectItem>
                          <SelectItem value="SUBSTITUTION">Substitution</SelectItem>
                          <SelectItem value="VAR">VAR Decision</SelectItem>
                          <SelectItem value="HALF_TIME">Half Time</SelectItem>
                          <SelectItem value="MATCH_END">Match End</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Team */}
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={homeTeam}>{homeTeam}</SelectItem>
                          <SelectItem value={awayTeam}>{awayTeam}</SelectItem>
                          <SelectItem value="MATCH_OFFICIAL">Match Official</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Player */}
                <FormField
                  control={form.control}
                  name="player"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Player name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Assisted By */}
                <FormField
                  control={form.control}
                  name="assistedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assisted By (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Assisting player name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about the event"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Match Timeline</CardTitle>
          <Button 
            onClick={saveTimeline} 
            disabled={isSubmitting || timeline.length === 0}
            className="bg-[#C5A464] hover:bg-[#B39355]"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Timeline
          </Button>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events added to the timeline yet
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4 p-3 border rounded-md">
                  <div className="min-w-[50px] text-center">
                    <span className="font-mono font-bold">{event.time}'</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getEventTypeColor(event.type)}>
                        {formatEventType(event.type)}
                      </Badge>
                      <span className="font-medium">{event.team}</span>
                    </div>
                    
                    {event.player && (
                      <p className="text-sm">
                        <span className="font-medium">Player:</span> {event.player}
                        {event.assistedBy && (
                          <span className="ml-1">
                            (Assisted by: {event.assistedBy})
                          </span>
                        )}
                      </p>
                    )}
                    
                    {event.description && (
                      <p className="text-sm mt-1 text-gray-600">{event.description}</p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeEvent(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 