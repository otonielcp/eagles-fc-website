"use client";

import { useState, useEffect } from "react";
import {
  getAllFormSubmissions,
  updateFormSubmissionStatus,
  updateFormSubmissionNotes,
  deleteFormSubmission,
} from "@/actions/formSubmission";
import {
  getAllPartnershipInquiries,
  updatePartnershipInquiryStatus,
  updatePartnershipInquiryNotes,
  deletePartnershipInquiry,
} from "@/actions/partnershipInquiry";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Mail,
  Phone,
  Globe,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  Inbox,
  Save,
  MapPin,
  Briefcase,
  UserPlus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface Submission {
  _id: string;
  source: "form" | "partnership";
  type: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  data?: Record<string, any>;
  // Partnership-specific
  firstName?: string;
  lastName?: string;
  title?: string;
  businessName?: string;
  businessWebsite?: string;
  description?: string;
  // Common
  status: string;
  notes: string;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  contact: { label: "Contact", color: "bg-blue-500", icon: Mail },
  registration: { label: "Registration", color: "bg-green-500", icon: UserPlus },
  operations: { label: "Operations", color: "bg-orange-500", icon: Briefcase },
  marketing: { label: "Marketing", color: "bg-pink-500", icon: Globe },
  media: { label: "Media", color: "bg-purple-500", icon: Globe },
  partnership: { label: "Partnership", color: "bg-amber-500", icon: Building2 },
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

export default function InboxPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [formData, partnershipData] = await Promise.all([
        getAllFormSubmissions(),
        getAllPartnershipInquiries(),
      ]);

      const formSubmissions: Submission[] = formData.map((s: any) => ({
        ...s,
        source: "form" as const,
      }));

      const partnershipSubmissions: Submission[] = partnershipData.map((p: any) => ({
        _id: p._id,
        source: "partnership" as const,
        type: "partnership",
        name: `${p.firstName} ${p.lastName}`.trim(),
        email: p.email,
        phone: p.phone,
        subject: p.businessName,
        message: p.description || "",
        firstName: p.firstName,
        lastName: p.lastName,
        title: p.title,
        businessName: p.businessName,
        businessWebsite: p.businessWebsite,
        description: p.description,
        status: p.status,
        notes: p.notes || "",
        createdAt: p.createdAt,
      }));

      const all = [...formSubmissions, ...partnershipSubmissions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setSubmissions(all);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (sub: Submission, status: string) => {
    let result;
    if (sub.source === "partnership") {
      result = await updatePartnershipInquiryStatus(sub._id, status as any);
    } else {
      result = await updateFormSubmissionStatus(sub._id, status as any);
    }
    if (result.success) {
      setSubmissions((prev) =>
        prev.map((s) => (s._id === sub._id ? { ...s, status } : s))
      );
      toast.success("Status updated");
    } else {
      toast.error(result.message);
    }
  };

  const handleSaveNotes = async (sub: Submission) => {
    setSavingNotes(sub._id);
    const notes = editingNotes[sub._id] ?? sub.notes ?? "";
    let result;
    if (sub.source === "partnership") {
      result = await updatePartnershipInquiryNotes(sub._id, notes);
    } else {
      result = await updateFormSubmissionNotes(sub._id, notes);
    }
    if (result.success) {
      setSubmissions((prev) =>
        prev.map((s) => (s._id === sub._id ? { ...s, notes } : s))
      );
      toast.success("Notes saved");
    } else {
      toast.error(result.message);
    }
    setSavingNotes(null);
  };

  const handleDelete = async (sub: Submission) => {
    let result;
    if (sub.source === "partnership") {
      result = await deletePartnershipInquiry(sub._id);
    } else {
      result = await deleteFormSubmission(sub._id);
    }
    if (result.success) {
      setSubmissions((prev) => prev.filter((s) => s._id !== sub._id));
      toast.success("Deleted");
    } else {
      toast.error(result.message);
    }
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.type === filter);

  const types = ["all", "contact", "registration", "partnership", "operations", "marketing", "media"];
  const counts: Record<string, number> = { all: submissions.length };
  for (const t of types) {
    if (t !== "all") counts[t] = submissions.filter((s) => s.type === t).length;
  }

  // Registration detail renderer
  const renderRegistrationDetails = (data: Record<string, any>) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Player Info</h4>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-500">Name:</span> {data.playerFirstName} {data.playerLastName} {data.playerSuffix || ""}</p>
          <p><span className="text-gray-500">Gender:</span> {data.playerGender}</p>
          <p><span className="text-gray-500">Birthday:</span> {data.playerBirthday}</p>
          <p><span className="text-gray-500">Position:</span> {data.position}</p>
          {data.currentClub && <p><span className="text-gray-500">Current Club:</span> {data.currentClub}</p>}
          {data.teamName && <p><span className="text-gray-500">Team:</span> {data.teamName}</p>}
          {data.yearsPlaying && <p><span className="text-gray-500">Years Playing:</span> {data.yearsPlaying}</p>}
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Parent/Guardian</h4>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-500">Name:</span> {data.parentFirstName} {data.parentLastName}</p>
          <p><span className="text-gray-500">Email:</span> {data.parentEmail}</p>
          <p><span className="text-gray-500">Phone:</span> {data.parentPhone}</p>
        </div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mt-4">Address</h4>
        <div className="space-y-1 text-sm">
          <p>{data.street}</p>
          <p>{data.city}, {data.state} {data.zipcode}</p>
        </div>
      </div>
      {data.soccerExperience && (
        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Experience</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{data.soccerExperience}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">All form submissions from the website</p>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => {
          const config = TYPE_CONFIG[t];
          const label = t === "all" ? "All" : config?.label || t;
          const count = counts[t] || 0;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === t
                  ? "bg-[#C5A464] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === t ? "bg-white/20" : "bg-gray-100"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submissions */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-white">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-muted-foreground mt-1">
            Form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub._id;
            const config = TYPE_CONFIG[sub.type] || TYPE_CONFIG.contact;
            const IconComp = config.icon;

            return (
              <div key={sub._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : sub._id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.color}/10 flex items-center justify-center`}>
                      <IconComp className={`w-5 h-5 text-gray-600`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {sub.type === "partnership" ? sub.businessName : sub.name}
                        </h3>
                        <Badge className={`${config.color} text-white text-[10px] px-2`}>
                          {config.label}
                        </Badge>
                        {sub.status === "new" && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {sub.type === "partnership"
                          ? `${sub.name}${sub.title ? ` · ${sub.title}` : ""} · ${sub.email}`
                          : `${sub.email}${sub.subject ? ` · ${sub.subject}` : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {format(new Date(sub.createdAt), "MMM dd, yyyy")}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact</h4>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${sub.email}`} className="text-[#C5A464] hover:underline" onClick={(e) => e.stopPropagation()}>
                            {sub.email}
                          </a>
                        </div>
                        {sub.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${sub.phone}`} className="text-[#C5A464] hover:underline" onClick={(e) => e.stopPropagation()}>
                              {sub.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {sub.type === "partnership" && (
                        <div className="space-y-2 text-sm">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Business</h4>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{sub.businessName}</span>
                          </div>
                          {sub.businessWebsite && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <a href={sub.businessWebsite} target="_blank" rel="noopener noreferrer" className="text-[#C5A464] hover:underline" onClick={(e) => e.stopPropagation()}>
                                {sub.businessWebsite}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Registration Details */}
                    {sub.type === "registration" && sub.data && renderRegistrationDetails(sub.data)}

                    {/* Message / Description */}
                    {(sub.message || sub.description) && sub.type !== "registration" && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">
                          {sub.type === "partnership" ? "Partnership Goals" : "Message"}
                        </h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                          {sub.type === "partnership" ? sub.description : sub.message}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Admin Notes</h4>
                      <div className="flex gap-2">
                        <textarea
                          value={editingNotes[sub._id] ?? sub.notes ?? ""}
                          onChange={(e) =>
                            setEditingNotes((prev) => ({ ...prev, [sub._id]: e.target.value }))
                          }
                          placeholder="Add notes..."
                          rows={2}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent resize-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleSaveNotes(sub); }}
                          disabled={savingNotes === sub._id}
                          className="bg-[#C5A464] hover:bg-[#B39355] self-end"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Status:</span>
                        <select
                          value={sub.status}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(sub, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {format(new Date(sub.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this {config.label.toLowerCase()} submission. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(sub)} className="bg-red-500 hover:bg-red-600 text-white">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}
