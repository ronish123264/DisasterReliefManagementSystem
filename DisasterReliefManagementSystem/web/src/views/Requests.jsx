import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Tag, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";
import { ProgressSteps } from "../components/motion.jsx";

const NEEDS = ["Food", "Drinking Water", "Medicine", "Clothes", "Other"];

/* Animated collapse for the filter row. Height animation is the
   one exception to transform-only motion: it is a one-shot layout
   transition on a small subtree, not a continuous loop. */
function FilterBar({ query, setQuery, status, setStatus }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={reduce ? undefined : { height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
        <div className="relative">
          <MagnifyingGlass size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, location, need"
            aria-label="Search requests"
            className={`${inputCls} w-64 pl-8.5`}
          />
        </div>
        <div className="flex gap-1" role="group" aria-label="Filter by status">
          {["All", "Pending", "Approved", "Rejected", "Delivered"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`cursor-pointer rounded border px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                status === s
                  ? "border-ink bg-ink text-[#fbfbf9]"
                  : "border-line-strong bg-transparent text-ink-soft hover:border-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RequestForm() {
  const { actions, user } = useApp();
  const [form, setForm] = useState({ needType: "Food", quantity: "", location: "", contact: user.phone || "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    actions.requestRelief({ ...form, quantity: parseInt(form.quantity, 10) });
    setForm({ needType: "Food", quantity: "", location: "", contact: user.phone || "" });
  }

  return (
    <Panel title="Request relief">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="What is needed" htmlFor="rqNeed">
          <select id="rqNeed" className={inputCls} value={form.needType} onChange={set("needType")}>
            {NEEDS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="How many people or units" htmlFor="rqQuantity">
          <input id="rqQuantity" type="number" min="1" className={inputCls} required value={form.quantity} onChange={set("quantity")} />
        </Field>
        <Field label="Delivery location" htmlFor="rqLocation">
          <input id="rqLocation" className={inputCls} required value={form.location} onChange={set("location")} />
        </Field>
        <Field label="Contact number" htmlFor="rqContact">
          <input id="rqContact" className={inputCls} required value={form.contact} onChange={set("contact")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit">Submit request</Button>
        </div>
      </form>
    </Panel>
  );
}

export default function Requests() {
  const { db, user, isStaff, isCitizen, isVolunteer, actions } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const pending = db.requests.filter((r) => r.status === "Pending").length;
  const approved = db.requests.filter((r) => r.status === "Approved").length;

  const q = query.trim().toLowerCase();
  const rows = db.requests.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (!q) return true;
    return [r.citizenName, r.location, r.needType, r.volunteer].some((v) => v && v.toLowerCase().includes(q));
  });

  return (
    <div>
      <PageHead title="Relief requests" sub="Needs filed by citizens, moved through approval to delivery." />

      <Reveal>
        <Panel
          title="Queue"
          meta={`${db.requests.length} total · ${pending} pending · ${approved} approved`}
          actions={
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={isStaff || isVolunteer ? "cursor-pointer text-[13px] font-semibold text-ink-soft hover:text-ink" : "hidden"}
            >
              {showFilters ? "Hide filters" : "Filter"}
            </button>
          }
        >
          {showFilters && (
            <FilterBar query={query} setQuery={setQuery} status={status} setStatus={setStatus} />
          )}
          {rows.length === 0 ? (
            db.requests.length === 0 ? (
              <EmptyState title="No requests yet"
                body="Citizens who need food, water, medicine or clothing file their request here." />
            ) : (
              <EmptyState title="No matches"
                body="No request matches the current search or status filter. Clear the filters to see the full queue." >
                <Button variant="line" size="sm" onClick={() => { setQuery(""); setStatus("All"); }}>
                  Clear filters
                </Button>
              </EmptyState>
            )
          ) : (
            <Table head={[{ label: "ID" }, { label: "Filed by" }, { label: "Location" }, { label: "Need" },
              { label: "Qty", num: true }, { label: "Status" }, { label: "Progress" }, { label: "Date" }, { label: "Volunteer" }, { label: "Action" }]}>
              {rows.map((r) => {
                let action = <span className="text-line-strong">-</span>;
                if (isStaff && r.status === "Pending") {
                  action = (
                    <span className="flex gap-1.5">
                      <Button size="sm" variant="ink" onClick={() => actions.decideRequest(r.id, "Approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="line" onClick={() => actions.decideRequest(r.id, "Rejected")}>
                        Reject
                      </Button>
                    </span>
                  );
                } else if (isVolunteer && (r.status === "Pending" || r.status === "Approved") && r.volunteer === "") {
                  action = (
                    <Button size="sm" onClick={() => actions.claimRequest(r.id)}>
                      Claim
                    </Button>
                  );
                } else if (r.status === "Approved" && r.volunteer !== "") {
                  action = (
                    <Button size="sm" variant="line" onClick={() => actions.decideRequest(r.id, "Delivered")}>
                      Mark delivered
                    </Button>
                  );
                }
                return (
                  <Row key={r.id}>
                    <IdCell id={r.id} />
                    <Td>{r.citizenName}</Td>
                    <Td>{r.location}</Td>
                    <Td>{r.needType}</Td>
                    <Td num>{r.quantity}</Td>
                    <Td><Tag status={r.status} /></Td>
                    <Td><ProgressSteps status={r.status} volunteer={r.volunteer} /></Td>
                    <Td className="font-mono text-[13px]">{r.date}</Td>
                    <Td>{r.volunteer || <span className="text-muted">unassigned</span>}</Td>
                    <Td className="whitespace-nowrap">{action}</Td>
                  </Row>
                );
              })}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isCitizen ? <RequestForm /> : (
        user ? <GatePanel title="Request relief" roleText="This form is for Citizen accounts. Demo citizen: sita / sita123." />
             : <GatePanel title="Request relief" />
      )}
    </div>
  );
}
