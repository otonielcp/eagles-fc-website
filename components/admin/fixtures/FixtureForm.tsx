"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2, ListChecks, Bold, Italic, List, ListOrdered, Quote, Undo2, Redo2 } from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";

import { createFixture, getFixtureById, updateFixture, uploadFixtureLogo } from "@/actions/fixture";
import LogoUploader from "@/components/admin/shared/LogoUploader";

// Rich Text Editor Component
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter text...",
  className 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4',
      },
    },
  });

  if (!editor) {
    return <div className="h-[200px] bg-gray-50 animate-pulse rounded-md" />;
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <span className="text-sm font-bold underline">U</span>
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />
        
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Headings */}
        <Select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            'paragraph'
          }
          onValueChange={(value) => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value.charAt(1)) as 1 | 2 | 3;
              if (level >= 1 && level <= 3) {
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }
          }}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Text</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Alignment */}
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          aria-label="Align Left"
        >
          <span className="text-xs">L</span>
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          aria-label="Align Center"
        >
          <span className="text-xs">C</span>
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          aria-label="Align Right"
        >
          <span className="text-xs">R</span>
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[150px] max-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

// Form schema
const fixtureFormSchema = z.object({
  // Match Information
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  stadium: z.string().min(1, "Stadium is required"),
  competition: z.string().min(1, "Competition is required"),
  competitionType: z.string().min(1, "Competition type is required"),
  seasonYear: z.string().min(1, "Season year is required"),
  month: z.string().min(1, "Month is required"),

  // Teams
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  homeTeamLogo: z.string().default(""),
  awayTeamLogo: z.string().default(""),

  // Result Information
  status: z.string().min(1, "Status is required"),
  homeScore: z.coerce.number().default(0),
  awayScore: z.coerce.number().default(0),

  // Additional Information
  leagueLogo: z.string().default(""),
  channelLogo: z.string().default(""),
  matchImage: z.string().default("/gameresultbg.jpeg"),

  // Match Details
  matchReport: z.string().default(""),
  highlights: z.string().default(""),

  // Featured Match
  isFeatured: z.boolean().default(false),
});

type FixtureFormValues = z.infer<typeof fixtureFormSchema>;

// Add this helper function before the component definition
function to12HourFormat(time24: string): string {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
}

export default function FixtureForm({ fixtureId }: { fixtureId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFixture, setIsLoadingFixture] = useState(!!fixtureId);
  const router = useRouter();

  // Initialize form
  const form = useForm<FixtureFormValues>({
    resolver: zodResolver(fixtureFormSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      time: "19:00",
      stadium: "",
      competition: "",
      competitionType: "",
      seasonYear: "2025",
      month: format(new Date(), "MMMM"),
      homeTeam: "",
      awayTeam: "",
      homeTeamLogo: "",
      awayTeamLogo: "",
      status: "SCHEDULED",
      homeScore: 0,
      awayScore: 0,
      leagueLogo: "",
      channelLogo: "",
      matchImage: "/gameresultbg.jpeg",
      matchReport: "",
      highlights: "",
      isFeatured: false,
    },
  });

  // Fetch fixture data if editing
  useEffect(() => {
    const fetchFixture = async () => {
      if (fixtureId) {
        try {
          const fixtureData = await getFixtureById(fixtureId);

          // Update form values
          Object.keys(fixtureData).forEach((key) => {
            if (key !== "_id" && key !== "createdAt" && key !== "updatedAt" && key !== "timeline") {
              form.setValue(key as any, fixtureData[key]);
            }
          });

          setIsLoadingFixture(false);
        } catch (error) {
          console.error("Error fetching fixture:", error);
          toast.error("Failed to load fixture data");
          setIsLoadingFixture(false);
        }
      }
    };

    fetchFixture();
  }, [fixtureId, form]);

  // Form submission handler
  async function onSubmit(values: FixtureFormValues) {
    setIsLoading(true);

    // Convert time to 12-hour format before saving
    const valuesWith12HourTime = {
      ...values,
      time: to12HourFormat(values.time),
    };

    try {
      if (fixtureId) {
        // Update existing fixture
        await updateFixture(fixtureId, valuesWith12HourTime);
        toast.success("Fixture updated successfully");
      } else {
        // Create new fixture
        await createFixture(valuesWith12HourTime);
        toast.success("Fixture created successfully");
      }

      router.push("/admin/fixtures");
    } catch (error) {
      console.error("Error saving fixture:", error);
      toast.error(fixtureId ? "Failed to update fixture" : "Failed to create fixture");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingFixture) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading fixture data...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Match Information</h2>

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Month */}
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ].map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stadium */}
                <FormField
                  control={form.control}
                  name="stadium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stadium</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter stadium name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Competition Details</h2>

                {/* Competition */}
                <FormField
                  control={form.control}
                  name="competition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter competition name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Competition Type */}
                <FormField
                  control={form.control}
                  name="competitionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter competition type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Season Year */}
                <FormField
                  control={form.control}
                  name="seasonYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season Year</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter season year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="LIVE">Live</SelectItem>
                          <SelectItem value="FT">Full Time</SelectItem>
                          <SelectItem value="POSTPONED">Postponed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Teams & Score</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Home Team</h3>

                {/* Home Team */}
                <FormField
                  control={form.control}
                  name="homeTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter home team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Home Team Logo */}
                <FormField
                  control={form.control}
                  name="homeTeamLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Logo</FormLabel>
                      <FormControl>
                        <LogoUploader
                          currentLogo={field.value}
                          onLogoChange={(url) => form.setValue("homeTeamLogo", url)}
                          label="Home Team Logo"
                          folder="teams"
                          uploadAction={uploadFixtureLogo}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Home Score */}
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Away Team</h3>

                {/* Away Team */}
                <FormField
                  control={form.control}
                  name="awayTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter away team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Away Team Logo */}
                <FormField
                  control={form.control}
                  name="awayTeamLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Logo</FormLabel>
                      <FormControl>
                        <LogoUploader
                          currentLogo={field.value}
                          onLogoChange={(url) => form.setValue("awayTeamLogo", url)}
                          label="Away Team Logo"
                          folder="teams"
                          uploadAction={uploadFixtureLogo}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Away Score */}
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Additional Information</h2>

            {/* Featured Match Checkbox */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-6">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Match</FormLabel>
                    <FormDescription>
                      This match will be highlighted on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* League Logo */}
              <FormField
                control={form.control}
                name="leagueLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>League Logo</FormLabel>
                    <FormControl>
                      <LogoUploader
                        currentLogo={field.value}
                        onLogoChange={(url) => form.setValue("leagueLogo", url)}
                        label="League Logo"
                        folder="logos"
                        uploadAction={uploadFixtureLogo}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Channel Logo */}
              <FormField
                control={form.control}
                name="channelLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Logo</FormLabel>
                    <FormControl>
                      <LogoUploader
                        currentLogo={field.value}
                        onLogoChange={(url) => form.setValue("channelLogo", url)}
                        label="Channel Logo"
                        folder="logos"
                        uploadAction={uploadFixtureLogo}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Match Image */}
            <div className="mt-6">
              <FormField
                control={form.control}
                name="matchImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Background Image</FormLabel>
                    <FormControl>
                      <LogoUploader
                        currentLogo={field.value}
                        onLogoChange={(url) => form.setValue("matchImage", url)}
                        label="Match Background"
                        folder="matches"
                        uploadAction={uploadFixtureLogo}
                      />
                    </FormControl>
                    <FormDescription>
                      Background image for match report and result pages
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 space-y-6">
              {/* Match Report with Rich Text Editor */}
              <FormField
                control={form.control}
                name="matchReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Report</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write a detailed match report..."
                        className="min-h-[250px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Create a comprehensive match report with rich formatting (can be added after the match)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Highlights */}
              <FormField
                control={form.control}
                name="highlights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highlights URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter highlights URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to match highlights video (can be added after the match)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/fixtures")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {fixtureId ? "Update Fixture" : "Create Fixture"}
          </Button>
        </div>

        {fixtureId && (
          <div className="mt-6">
            <Link href={`/admin/fixtures/${fixtureId}/timeline`}>
              <Button type="button" variant="outline" className="w-full">
                <ListChecks className="mr-2 h-4 w-4" />
                Manage Match Timeline
              </Button>
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
}