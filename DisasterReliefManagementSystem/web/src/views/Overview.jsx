import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowsClockwise, Megaphone } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import { btn, Reveal } from "../components/ui.jsx";

const ROLES = [
  ["Admin", "Full control: shelters, stock, approvals, accounts and the summary report."],
  ["Municipality", "Owns disaster status, shelter intake and request approvals for its district."],
  ["Volunteer", "Claims pending requests and keeps availability current."],
  ["Citizen", "Reports disasters and missing persons, requests relief, donates."],
];

const CYCLE = [
  ["Report", "A citizen files the event, the missing person or the need. It enters the queue as pending."],
  ["Verify", "The municipality confirms it against ground reports and sets a status and severity."],
  ["Deliver", "An approved request moves to a volunteer, who claims it and draws stock from a warehouse."],
  ["Close", "Delivered and found are final states. Donations count toward what closed."],
];

const PERILS = [
  ["Earthquake", "Structural damage reports routed to the nearest assessed shelter; road blocks flagged on the record."],
  ["Flood", "Riverine and urban flood zones with water, food and boat requests tied to the affected wards."],
  ["Landslide", "Route closures logged so relief movements re-plan around blocked corridors."],
  ["Forest fire", "Fire alerts with volunteer call-out and medical supply requests for nearby settlements."],
];

function Figure({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[22px] leading-none font-medium tracking-tight">{value}</dd>
    </div>
  );
}

export default function Overview() {
  const { db, user, showSection } = useApp();
  const reduce = useReducedMotion();

  const openRequests = db.requests.filter((r) => r.status === "Pending" || r.status === "Approved").length;
  const freeSpace = db.shelters.reduce((sum, s) => sum + (s.capacity - s.occupied), 0);
  const totalMoney = db.donations.reduce((sum, d) => sum + d.amount, 0);

  const heroImg = (
    <div className="relative overflow-hidden rounded-md border border-line">
      <img
        src="https://picsum.photos/seed/nepal-relief-convoy-mountain/900/640"
        alt="Relief convoy on a mountain road in Nepal"
        className="h-full w-full object-cover grayscale-[35%] transition-transform duration-500 hover:scale-[1.015]"
        loading="eager"
      />
    </div>
  );

  return (
    <div>
      {/* masthead */}
      <div className="grid items-start gap-12 pt-14 pb-12 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="mb-3 text-[13px] font-semibold text-muted">
            Earthquake, flood, landslide and forest fire response across Nepal
          </p>
          <h1 className="mb-4 max-w-[17ch] text-[clamp(30px,4.2vw,46px)] leading-[1.08] font-bold tracking-[-0.025em]">
            Know what is hit, what is held, and what is still needed.
          </h1>
          <p className="mb-6 max-w-[54ch] text-ink-soft">
            DRMS keeps one record of affected areas, shelter capacity, supplies, volunteers,
            relief requests and missing persons, shared between the municipality, its
            volunteers and the public.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className={btn("solid")} onClick={() => showSection("requests")}>
              Open relief queue
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </button>
            <button className={btn("line")} onClick={() => showSection(user ? "disasters" : "login")}>
              {user ? "View active disasters" : "Log in"}
            </button>
          </div>
        </div>

        {/* right column: image over figures, no fake dashboard */}
        <div>
          {!reduce ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 aspect-16/10">{heroImg}</div>
            </motion.div>
          ) : (
            <div className="mb-6 aspect-16/10">{heroImg}</div>
          )}
          <dl className="border-t border-line-strong">
            <Figure label="Active disasters" value={db.disasters.filter((d) => d.status !== "Resolved").length} />
            <Figure label="Open requests" value={openRequests} />
            <Figure label="Shelter space free" value={freeSpace} />
            <Figure label="Donations received" value={`Rs. ${totalMoney.toLocaleString()}`} />
          </dl>
        </div>
      </div>

      {/* roles: hairline rows, not cards */}
      <Reveal className="border-t border-line py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-xl font-bold tracking-tight">Who uses it</h2>
          <ul role="list">
            {ROLES.map(([name, job]) => (
              <li key={name} className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6">
                <span className="text-sm font-semibold">{name}</span>
                <span className="text-sm text-ink-soft">{job}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* cycle: split with photo */}
      <Reveal className="border-t border-line py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Response cycle</h2>
            <p className="mt-2 max-w-[34ch] text-sm text-muted">
              The same record carries through all four stages, so nothing restarts at each handoff.
            </p>
            <div className="mt-6 hidden aspect-4/3 max-w-[340px] overflow-hidden rounded-md border border-line lg:block">
              <img
                src="https://picsum.photos/seed/nepal-flood-rescue-boat/680/510"
                alt="Rescue team moving supplies by boat during flood response"
                className="h-full w-full object-cover grayscale-[35%]"
                loading="lazy"
              />
            </div>
          </div>
          <ul role="list" className="self-start">
            {CYCLE.map(([label, body]) => (
              <li key={label} className="grid gap-1 border-b border-line py-3.5 last:border-b-0 sm:grid-cols-[120px_1fr] sm:gap-6">
                <span className="flex items-start gap-2 text-sm font-semibold">
                  {label === "Report" && <Megaphone size={15} weight="duotone" className="mt-1 shrink-0 text-accent" aria-hidden="true" />}
                  {label === "Close" && <ArrowsClockwise size={15} weight="duotone" className="mt-1 shrink-0 text-accent" aria-hidden="true" />}
                  {label}
                </span>
                <span className="text-sm text-ink-soft">{body}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* perils: 2x2 hairline grid, no boxes */}
      <Reveal className="border-t border-line py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-xl font-bold tracking-tight">Peril types</h2>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {PERILS.map(([name, body]) => (
              <div key={name} className="border-b border-line py-3.5">
                <h3 className="text-[15px] font-semibold">{name}</h3>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
