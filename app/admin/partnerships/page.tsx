"use client";

import { useState, useEffect, useCallback } from "react";
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
  MessageSquare,
  Save,
  Handshake,
  Clock,
  Search,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  CircleDot,
  ArrowUpRight,
  CalendarDays,
  StickyNote,
  ExternalLink,
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
import { format, formatDistanceToNow } from "date-fns";

interface Inquiry {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  businessName: string;
  businessWebsite: string;
  email: string;
  phone: string;
  description: string;
  status: "new" | "contacted" | "in_progress" | "closed";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  new: {
    label: "New",
    icon: Sparkles,
    dotColor: "bg-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    gradient: "from-emerald-500 to-emerald-600",
  },
  contacted: {
    label: "Contacted",
    icon: Mail,
    dotColor: "bg-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/20",
    gradient: "from-amber-500 to-amber-600",
  },
  in_progress: {
    label: "In Progress",
    icon: TrendingUp,
    dotColor: "bg-violet-400",
    badgeBg: "bg-violet-500/10",
    badgeText: "text-violet-400",
    badgeBorder: "border-violet-500/20",
    gradient: "from-violet-500 to-violet-600",
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    dotColor: "bg-zinc-400",
    badgeBg: "bg-zinc-500/10",
    badgeText: "text-zinc-400",
    badgeBorder: "border-zinc-500/20",
    gradient: "from-zinc-500 to-zinc-600",
  },
} as const;

export default function PartnershipsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Inquiry["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await getAllPartnershipInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error("Failed to load partnership inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
    const result = await updatePartnershipInquiryStatus(id, status);
    if (result.success) {
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
      );
      toast.success("Status updated");
    } else {
      toast.error(result.message);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(id);
    const notes = editingNotes[id] ?? inquiries.find((i) => i._id === id)?.notes ?? "";
    const result = await updatePartnershipInquiryNotes(id, notes);
    if (result.success) {
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, notes } : inq))
      );
      toast.success("Notes saved");
    } else {
      toast.error(result.message);
    }
    setSavingNotes(null);
  };

  const handleDelete = async (id: string) => {
    const result = await deletePartnershipInquiry(id);
    if (result.success) {
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      toast.success("Inquiry deleted");
    } else {
      toast.error(result.message);
    }
  };

  const searchFiltered = searchQuery
    ? inquiries.filter(
        (i) =>
          i.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inquiries;

  const filtered =
    filter === "all"
      ? searchFiltered
      : searchFiltered.filter((i) => i.status === filter);

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    in_progress: inquiries.filter((i) => i.status === "in_progress").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A464]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A464]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C5A464] to-[#9A7B3E] shadow-lg shadow-[#C5A464]/20">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Partnership Inquiries
                </h1>
                <p className="text-zinc-400 text-sm mt-0.5">
                  Manage and track business partnership opportunities
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            <Clock className="w-3.5 h-3.5" />
            <span>Last updated: {format(new Date(), "MMM dd, h:mm a")}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-5 gap-3 mt-8">
          {([
            { key: "all" as const, label: "Total", icon: Handshake },
            { key: "new" as const, label: "New", icon: Sparkles },
            { key: "contacted" as const, label: "Contacted", icon: Mail },
            { key: "in_progress" as const, label: "In Progress", icon: TrendingUp },
            { key: "closed" as const, label: "Closed", icon: CheckCircle2 },
          ] as const).map((item) => {
            const isActive = filter === item.key;
            const config = item.key === "all" ? null : STATUS_CONFIG[item.key];
            return (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`group relative rounded-xl p-4 text-left transition-all duration-300 border ${
                  isActive
                    ? "bg-[#C5A464]/15 border-[#C5A464]/40 shadow-lg shadow-[#C5A464]/10"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isActive ? "text-[#C5A464]" : "text-zinc-500"
                    }`}
                  >
                    {item.label}
                  </span>
                  {config && (
                    <span
                      className={`w-2 h-2 rounded-full ${config.dotColor} ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-3xl font-bold tracking-tight ${
                    isActive ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {counts[item.key]}
                </p>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#C5A464]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by business name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A464]/30 focus:border-[#C5A464] transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl border border-gray-100">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-[3px] border-gray-100 border-t-[#C5A464] animate-spin" />
            <Handshake className="absolute inset-0 m-auto w-5 h-5 text-[#C5A464]" />
          </div>
          <p className="text-sm text-gray-400 mt-4">Loading inquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-5 border border-gray-200">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No inquiries found</h3>
          <p className="text-sm text-gray-400 mt-1.5 max-w-sm text-center">
            {searchQuery
              ? `No results match "${searchQuery}". Try a different search.`
              : filter === "all"
              ? "Partnership inquiries will appear here when businesses submit the form on your website."
              : `No ${filter.replace("_", " ")} inquiries at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => {
            const isExpanded = expandedId === inquiry._id;
            const config = STATUS_CONFIG[inquiry.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={inquiry._id}
                className={`group bg-white rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? "border-[#C5A464]/30 shadow-xl shadow-[#C5A464]/5 ring-1 ring-[#C5A464]/10"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
              >
                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : inquiry._id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A464]/10 to-[#C5A464]/5 flex items-center justify-center border border-[#C5A464]/10">
                        <Building2 className="w-5 h-5 text-[#C5A464]" />
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${config.dotColor}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                          {inquiry.businessName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 truncate">
                          {inquiry.firstName} {inquiry.lastName}
                          {inquiry.title && (
                            <span className="text-gray-300 mx-1">·</span>
                          )}
                          {inquiry.title && (
                            <span className="text-gray-400">{inquiry.title}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                      <span className="text-xs text-gray-400">
                        {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {formatDistanceToNow(new Date(inquiry.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "bg-[#C5A464]/10 rotate-0"
                          : "bg-gray-50 group-hover:bg-gray-100"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#C5A464]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-5 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                    {/* Contact & Business Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Contact Info Card */}
                      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 p-5 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-4 h-4 text-[#C5A464]" />
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Contact Information
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                              <User className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {inquiry.firstName} {inquiry.lastName}
                              </p>
                              {inquiry.title && (
                                <p className="text-xs text-gray-400">{inquiry.title}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                              <Mail className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="text-[#C5A464] hover:text-[#B39355] font-medium transition-colors flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {inquiry.email}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                              <Phone className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="text-[#C5A464] hover:text-[#B39355] font-medium transition-colors flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {inquiry.phone}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Business Info Card */}
                      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 p-5 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-4 h-4 text-[#C5A464]" />
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Business Details
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                              <Building2 className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <p className="font-medium text-gray-800">
                              {inquiry.businessName}
                            </p>
                          </div>
                          {inquiry.businessWebsite && (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                                <Globe className="w-3.5 h-3.5 text-gray-500" />
                              </div>
                              <a
                                href={inquiry.businessWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C5A464] hover:text-[#B39355] font-medium transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {inquiry.businessWebsite.replace(/^https?:\/\//, "")}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                              <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Submitted{" "}
                                {format(
                                  new Date(inquiry.createdAt),
                                  "MMMM dd, yyyy"
                                )}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                at{" "}
                                {format(new Date(inquiry.createdAt), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partnership Goals */}
                    {inquiry.description && (
                      <div className="rounded-xl bg-gradient-to-br from-[#C5A464]/[0.04] to-transparent p-5 border border-[#C5A464]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Handshake className="w-4 h-4 text-[#C5A464]" />
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Partnership Goals
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {inquiry.description}
                        </p>
                      </div>
                    )}

                    {/* Admin Notes */}
                    <div className="rounded-xl bg-white p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <StickyNote className="w-4 h-4 text-[#C5A464]" />
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Internal Notes
                        </h4>
                      </div>
                      <div className="flex gap-3">
                        <textarea
                          value={editingNotes[inquiry._id] ?? inquiry.notes ?? ""}
                          onChange={(e) =>
                            setEditingNotes((prev) => ({
                              ...prev,
                              [inquiry._id]: e.target.value,
                            }))
                          }
                          placeholder="Add private notes about this inquiry..."
                          rows={3}
                          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] resize-none bg-gray-50/50 placeholder:text-gray-300 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveNotes(inquiry._id);
                          }}
                          disabled={savingNotes === inquiry._id}
                          className="bg-gradient-to-r from-[#C5A464] to-[#B39355] hover:from-[#B39355] hover:to-[#9A7B3E] text-white shadow-md shadow-[#C5A464]/20 self-end px-4 h-10 rounded-xl transition-all"
                        >
                          {savingNotes === inquiry._id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </span>
                        <div className="relative">
                          <select
                            value={inquiry.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(
                                inquiry._id,
                                e.target.value as Inquiry["status"]
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="appearance-none text-sm border border-gray-200 rounded-xl pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A464]/20 focus:border-[#C5A464] bg-white cursor-pointer font-medium text-gray-700 transition-all hover:border-gray-300"
                          >
                            {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                              <option key={value} value={value}>
                                {cfg.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 border-gray-200 rounded-xl transition-all h-9 px-3 gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the partnership inquiry from{" "}
                              <strong>{inquiry.businessName}</strong>. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(inquiry._id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            >
                              Delete Inquiry
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
