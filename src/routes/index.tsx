import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Inbox,
  Loader2,
  Search,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TicketPilot — AI Triage for Support Teams" },
      {
        name: "description",
        content:
          "TicketPilot automatically triages incoming support tickets by urgency so your team fixes what matters first.",
      },
      { property: "og:title", content: "TicketPilot — AI Triage for Support Teams" },
      {
        property: "og:description",
        content:
          "TicketPilot automatically triages incoming support tickets by urgency so your team fixes what matters first.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------------------------------- data ---------------------------------- */

type Urgency = "high" | "medium" | "low";

interface Ticket {
  id: number;
  customer: string;
  company: string;
  email: string;
  plan: string;
  subject: string;
  message: string;
  received: string;
  urgency: Urgency;
  reason: string;
  action: string;
}

const TICKETS: Ticket[] = [
  {
    id: 1,
    customer: "Sarah Chen",
    company: "Northwind Labs",
    email: "sarah.chen@northwindlabs.com",
    plan: "Scale",
    subject: "Charged twice on this month's invoice",
    message:
      "Hi team — I was charged twice for our September invoice. There are two identical charges of $1,240 on Sep 26 and our finance team flagged it during reconciliation. I need this corrected before we close the books on Friday. Please confirm the refund and make sure the billing job doesn't double-charge us again next month.",
    received: "6m ago",
    urgency: "high",
    reason: "Customer reports being charged twice for the same invoice.",
    action: "Verify the billing job, refund the duplicate $1,240 charge, and confirm in writing before Sep 30.",
  },
  {
    id: 2,
    customer: "David Okafor",
    company: "Brightpath",
    email: "d.okafor@brightpath.io",
    plan: "Enterprise",
    subject: "Complete outage since 06:00 UTC",
    message:
      "Production is completely down since 06:00 UTC. None of our 3,000 daily users can load the app — requests hang and then time out. Your status page still says 'All systems operational', which our leadership team is not happy about. We're losing sales by the hour and I need an ETA for restoration immediately.",
    received: "14m ago",
    urgency: "high",
    reason: "Full production outage affecting every customer account.",
    action: "Escalate to on-call engineering now; post a status-page incident and reply with an ETA.",
  },
  {
    id: 3,
    customer: "Alicia Fontaine",
    company: "Vertex Retail",
    email: "alicia.fontaine@vertexretail.com",
    plan: "Enterprise",
    subject: "Third ticket this week — very disappointed",
    message:
      "This is the third ticket I've opened this week and easily the slowest support I've had from any vendor in years. If this is what enterprise support looks like, we'll be evaluating alternatives ahead of our January renewal. I need to speak with a manager today about how these delays are going to be fixed.",
    received: "28m ago",
    urgency: "high",
    reason: "Escalation risk — customer threatening to churn at renewal.",
    action: "Flag for the account manager, arrange a manager call today, and log a churn-risk note.",
  },
  {
    id: 4,
    customer: "Tom Whitfield",
    company: "Slate Logistics",
    email: "tom.whitfield@slatelogistics.com",
    plan: "Growth",
    subject: "API returning 401 after key rotation",
    message:
      "After rotating our API key on Friday, every request returns 401 Unauthorized. Order sync between our warehouse system and your platform has been down all weekend. I've re-generated the key twice and double-checked the auth header — same result. Can someone check whether our new key was actually activated?",
    received: "41m ago",
    urgency: "high",
    reason: "Integration failure blocking the customer's order sync.",
    action: "Check key activation on the account, then walk the customer through a live re-auth.",
  },
  {
    id: 5,
    customer: "Priya Nair",
    company: "Cobalt Health",
    email: "priya.nair@cobalthealth.org",
    plan: "Scale",
    subject: "Dashboard takes 20+ seconds to load",
    message:
      "For the past three days the dashboard takes over 20 seconds to load, sometimes timing out entirely. It's slowing our morning stand-up and the team is getting visibly frustrated. Happens on Chrome, latest version, on two different office networks, so it doesn't look like it's on our end.",
    received: "1h ago",
    urgency: "medium",
    reason: "Performance degradation affecting the team's daily workflow.",
    action: "Reproduce the slow load, check for a regional performance regression, share findings.",
  },
  {
    id: 6,
    customer: "Jonas Berg",
    company: "Fern & Field",
    email: "jonas@fernandfield.se",
    plan: "Growth",
    subject: "Refund for duplicate seat licenses",
    message:
      "We downgraded from 12 seats to 8 last month but were billed for all 12 on Sep 24. I'd like a refund of the 4 extra seats ($196). Happy to forward the downgrade confirmation email if that helps. Everything else with the account is working fine.",
    received: "2h ago",
    urgency: "medium",
    reason: "Standard refund request within the 30-day policy window.",
    action: "Verify the downgrade timestamp, approve the $196 refund, confirm by email.",
  },
  {
    id: 7,
    customer: "Hannah Kim",
    company: "Orchard Systems",
    email: "hannah.kim@orchardsystems.com",
    plan: "Scale",
    subject: "Question about an 'Overage — API calls' line item",
    message:
      "Quick question about our September invoice: there's a line item called 'Overage — API calls' for $89 that we weren't expecting. Can you help me understand which usage triggered it, and whether it will repeat next month? Not an error as far as I can tell — we'd just like to plan for it.",
    received: "3h ago",
    urgency: "medium",
    reason: "Billing clarification — unexpected line item, no error reported.",
    action: "Pull the API usage report for September and explain the overage trigger.",
  },
  {
    id: 8,
    customer: "Emily Torres",
    company: "Kite & Co",
    email: "emily@kiteandco.com",
    plan: "Starter",
    subject: "Can't log into my account",
    message:
      "Hi! I can't log into my account this morning. I've tried resetting my password but never receive the reset email — I've checked spam and promotions folders too. Could you help me get back in? I have a client demo at 4pm today.",
    received: "4h ago",
    urgency: "low",
    reason: "Routine password reset; login issue for a single user.",
    action: "Resend the reset link from the admin console and confirm delivery.",
  },
  {
    id: 9,
    customer: "Marcus Webb",
    company: "Lumen Analytics",
    email: "marcus.webb@lumenanalytics.ai",
    plan: "Growth",
    subject: "Feature request: bulk CSV export for reports",
    message:
      "Love the product so far — really strong this year. One ask: any chance you'd consider adding bulk CSV export for reports? We currently pull data report-by-report and it eats about an hour of my week. No rush, just wanted to get it on the roadmap radar.",
    received: "5h ago",
    urgency: "low",
    reason: "Non-urgent feature suggestion from a happy customer.",
    action: "Log the request in the feature board and send a thank-you reply.",
  },
  {
    id: 10,
    customer: "Leo Martins",
    company: "Driftwood Studio",
    email: "leo@driftwood.studio",
    plan: "Starter",
    subject: "How do I invite teammates to my workspace?",
    message:
      "We just signed up and I can't figure out how to invite my two teammates to the workspace. Also, is there a seat limit on the Starter plan, or do we need to upgrade? Thanks in advance!",
    received: "6h ago",
    urgency: "low",
    reason: "Simple how-to question from a new customer.",
    action: "Send the invite walkthrough and a link to the plan comparison page.",
  },
];

const URGENCY_META: Record<
  Urgency,
  { label: string; dot: string; badge: string; pulseDot: string }
> = {
  high: {
    label: "High",
    dot: "bg-high",
    badge: "text-high bg-high-soft border-high-border",
    pulseDot: "shadow-[0_0_0_3px_var(--high-soft)]",
  },
  medium: {
    label: "Medium",
    dot: "bg-medium",
    badge: "text-medium bg-medium-soft border-medium-border",
    pulseDot: "shadow-[0_0_0_3px_var(--medium-soft)]",
  },
  low: {
    label: "Low",
    dot: "bg-low",
    badge: "text-low bg-low-soft border-low-border",
    pulseDot: "shadow-[0_0_0_3px_var(--low-soft)]",
  },
};

const FILTERS: Array<{ key: "all" | Urgency; label: string }> = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* -------------------------------- components ------------------------------- */

function UrgencyBadge({ urgency, tagging }: { urgency: Urgency; tagging?: boolean }) {
  if (tagging) {
    return <div className="h-5.5 w-16 animate-pulse rounded-full bg-muted" />;
  }
  const meta = URGENCY_META[urgency];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium animate-in fade-in zoom-in-95 ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function Sidebar() {
  const items = [
    { icon: Inbox, label: "Inbox", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          TicketPilot
        </span>
      </div>
      <nav className="mt-2 flex flex-col gap-1 px-3">
        {items.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-5 pb-5">
        <div className="rounded-xl border border-border bg-muted/50 p-3.5">
          <p className="text-xs font-semibold text-foreground">Marta Silva</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Head of Customer Success</p>
        </div>
      </div>
    </aside>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-2xl border p-5 transition-colors ${
        accent ? "border-high-border bg-high-soft" : "border-border bg-card"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function TicketRow({
  ticket,
  tagging,
  onOpen,
}: {
  ticket: Ticket;
  tagging: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group block w-full rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-[0_4px_16px_-6px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {initials(ticket.customer)}
            </span>
            <span className="truncate text-sm font-semibold text-foreground">
              {ticket.customer}
            </span>
            <span className="truncate text-sm text-muted-foreground">· {ticket.company}</span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {ticket.received}
            </span>
          </div>
          <p className="mt-2 truncate text-sm font-medium text-foreground">{ticket.subject}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {ticket.message}
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          <UrgencyBadge urgency={ticket.urgency} tagging={tagging} />
        </div>
      </div>
    </button>
  );
}

function TicketDetail({
  ticket,
  onBack,
  onSent,
}: {
  ticket: Ticket;
  onBack: () => void;
  onSent: () => void;
}) {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const meta = URGENCY_META[ticket.urgency];

  function send() {
    if (!reply.trim()) return;
    setSent(true);
    onSent();
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 -ml-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inbox
      </button>

      <div className="mt-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {ticket.subject}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {ticket.customer} · {ticket.company} · received {ticket.received}
            </p>
          </div>
          <UrgencyBadge urgency={ticket.urgency} />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            {initials(ticket.customer)}
          </span>
          <p className="text-sm leading-relaxed text-foreground">{ticket.message}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Customer info
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate font-medium text-foreground">{ticket.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Company</dt>
                <dd className="font-medium text-foreground">{ticket.company}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium text-foreground">{ticket.plan}</dd>
              </div>
            </dl>
          </div>

          <div className={`rounded-xl border p-4 ${meta.badge}`}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <p className="text-xs font-semibold uppercase tracking-wide">AI analysis</p>
            </div>
            <div className="mt-3">
              <UrgencyBadge urgency={ticket.urgency} />
            </div>
            <p className="mt-2.5 text-sm font-medium">{ticket.reason}</p>
            <p className="mt-2 text-xs leading-relaxed opacity-80">
              Suggested next step: {ticket.action}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-foreground" htmlFor="reply">
            Reply
          </label>
          {sent ? (
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-low-border bg-low-soft px-4 py-3 text-sm font-medium text-low">
              <CheckCircle2 className="h-4 w-4" />
              Reply sent to {ticket.customer}. Ticket status updated to “Awaiting customer”.
            </div>
          ) : (
            <>
              <textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder={`Write a reply to ${ticket.customer.split(" ")[0]}…`}
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={send}
                  disabled={!reply.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function Index() {
  const [filter, setFilter] = useState<"all" | Urgency>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tagging, setTagging] = useState(false);
  const [justTagged, setJustTagged] = useState(false);
  const timers = useRef<number[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TICKETS.filter((t) => {
      if (filter !== "all" && t.urgency !== filter) return false;
      if (!q) return true;
      return [t.customer, t.company, t.subject, t.message]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, search]);

  const highCount = TICKETS.filter((t) => t.urgency === "high").length;
  const selected = TICKETS.find((t) => t.id === selectedId) ?? null;

  function autoTagAll() {
    if (tagging) return;
    timers.current.forEach(clearTimeout);
    setJustTagged(false);
    setTagging(true);
    timers.current = [
      window.setTimeout(() => setTagging(false), 1500),
      window.setTimeout(() => setJustTagged(true), 1500),
      window.setTimeout(() => setJustTagged(false), 3100),
    ];
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-8 py-8">
          {selected ? (
            <TicketDetail
              key={selected.id}
              ticket={selected}
              onBack={() => setSelectedId(null)}
              onSent={() => undefined}
            />
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Inbox</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {TICKETS.length} open tickets · triaged by AI
                  </p>
                </div>
                <button
                  onClick={autoTagAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                  {tagging ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {tagging ? "Auto-tagging…" : "Auto-tag all"}
                </button>
              </div>

              <div className="mt-6 flex gap-4">
                <StatCard
                  label="Open tickets"
                  value={String(TICKETS.length)}
                  hint="Across 6 agents today"
                />
                <StatCard
                  label="High urgency"
                  value={String(highCount)}
                  hint="Needs action right away"
                  accent
                />
                <StatCard
                  label="Avg. resolution"
                  value="3h 42m"
                  hint="Last 7 days · down 18%"
                />
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
                  {FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        filter === key
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="relative ml-auto w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tickets…"
                    className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {justTagged && (
                  <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    All {filtered.length} tickets re-analyzed and tagged by AI.
                  </div>
                )}
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                    No tickets match your search.
                  </div>
                ) : (
                  filtered.map((t) => (
                    <TicketRow
                      key={t.id}
                      ticket={t}
                      tagging={tagging}
                      onOpen={() => setSelectedId(t.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
