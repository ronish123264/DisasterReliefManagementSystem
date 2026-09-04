import { Fragment, useState } from "react";
import { WarningOctagon } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Tag, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

const TYPES = ["Earthquake", "Flood", "Landslide", "Forest Fire", "Other"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Reported", "Ongoing", "Resolved"];

function ReportForm() {
  const { actions } = useApp();
  const [form, setForm] = useState({ type: "Flood", severity: "Medium", location: "", description: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    actions.reportDisaster(form);
    setForm({ type: "Flood", severity: "Medium", location: "", description: "" });
  }

  return (
    <Panel title="File a disaster report">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Disaster type" htmlFor="disType">
          <select id="disType" className={inputCls} value={form.type} onChange={set("type")}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Severity" htmlFor="disSeverity">
          <select id="disSeverity" className={inputCls} value={form.severity} onChange={set("severity")}>
            {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Location" htmlFor="disLocation">
          <input id="disLocation" className={inputCls} required value={form.location} onChange={set("location")}
            placeholder="Village, municipality or district" />
        </Field>
        <Field label="Short description" htmlFor="disDescription" wide>
          <input id="disDescription" className={inputCls} required value={form.description} onChange={set("description")}
            placeholder="What happened, and how bad" />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit">File report</Button>
        </div>
      </form>
    </Panel>
  );
}

function GuestGate() {
  return <GatePanel title="File a disaster report" roleText="This form is for Citizen accounts. Demo citizen: sita / sita123." />;
}

export default function Disasters() {
  const { db, isStaff, isCitizen, actions } = useApp();

  const head = [{ label: "ID" }, { label: "Type" }, { label: "Location" }, { label: "Severity" },
    { label: "Date" }, { label: "Status" }, { label: "Filed by" }];
  if (isStaff) head.push({ label: "Set status" });

  return (
    <div>
      <PageHead title="Disaster reports" sub="Every event filed into the system, with its live status." />

      <Reveal>
        <Panel title="Registered events" meta={`${db.disasters.length} events`}>
          {db.disasters.length === 0 ? (
            <EmptyState icon={WarningOctagon} title="Nothing on record"
              body="No disaster has been reported yet. Reports filed by citizens appear here immediately." />
          ) : (
            <Table head={head}>
              {db.disasters.map((d) => (
                <Fragment key={d.id}>
                  <Row>
                    <IdCell id={d.id} />
                    <Td>{d.type}</Td>
                    <Td>{d.location}</Td>
                    <Td><Tag status={d.severity} /></Td>
                    <Td className="font-mono">{d.date}</Td>
                    <Td><Tag status={d.status} /></Td>
                    <Td>{d.reportedBy}</Td>
                    {isStaff && (
                      <Td>
                        <label className="sr-only" htmlFor={`dis-status-${d.id}`}>Set status for event {d.id}</label>
                        <select
                          id={`dis-status-${d.id}`}
                          className="rounded-md border border-line-strong bg-surface px-2 py-1 font-mono text-xs text-ink focus:outline-2 focus:outline-accent"
                          value={d.status}
                          onChange={(e) => actions.setDisasterStatus(d.id, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </Td>
                    )}
                  </Row>
                  <tr className="text-[13px] text-muted hover:bg-surface">
                    <td colSpan={isStaff ? 8 : 7} className="px-3.5 pt-0 pb-2 leading-snug">{d.description}</td>
                  </tr>
                </Fragment>
              ))}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isCitizen ? <ReportForm /> : <GuestGate />}
    </div>
  );
}
