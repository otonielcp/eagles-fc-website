import {
  Sparkles,
  Search,
  CalendarClock,
  FileSignature,
  BadgeCheck,
  XCircle,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { STAGE_LABELS, type Stage } from "@/lib/hiring";

export const STAGE_STYLES: Record<Stage, { icon: LucideIcon; dot: string; badge: string }> = {
  new: { icon: Sparkles, dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  screening: { icon: Search, dot: "bg-sky-400", badge: "bg-sky-50 text-sky-700 border-sky-200" },
  interview: { icon: CalendarClock, dot: "bg-violet-400", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  offer: { icon: FileSignature, dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  hired: { icon: BadgeCheck, dot: "bg-[#C5A464]", badge: "bg-[#C5A464]/10 text-[#8A6D35] border-[#C5A464]/30" },
  rejected: { icon: XCircle, dot: "bg-rose-400", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  withdrawn: { icon: Undo2, dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export default function StageBadge({ stage }: { stage: Stage }) {
  const style = STAGE_STYLES[stage];
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${style.badge}`}>
      <Icon className="w-3 h-3" />
      {STAGE_LABELS[stage]}
    </span>
  );
}
