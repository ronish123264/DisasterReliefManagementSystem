import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Tag, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

function MissingForm() {
  const { actions } = useApp();
  const [form, setForm] = useState({ name: "", age: "", lastSeen: "", contact: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    actions.reportMissing({ ...form, age: parseInt(form.age, 10) });
    setForm({ name: "", age: "", lastSeen: "", contact: "" });
  }

  return (
    <Panel title="File a missing person report">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="mpName">
          <input id="mpName" className={inputCls} required value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Age" htmlFor="mpAge">
          <input id="mpAge" type="number" min="0" max="120" className={inputCls} required value={form.age} onChange={set("age")} />
        </Field>
        <Field label="Where last seen" htmlFor="mpLastSeen">
          <input id="mpLastSeen" className={inputCls} required value={form.lastSeen} onChange={set("lastSeen")} />
        </Field>
        <Field label="Your contact number" htmlFor="mpContact">
          <input id="mpContact" className={inputCls} required value={form.contact} onChange={set("contact")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit">File report</Button>
        </div>
      </form>
    </Panel>
  );
}

export default function Missing() {
  const { db, isStaff, isCitizen, actions } = useApp();
  const stillMissing = db.missing.filter((m) => m.status === "Missing").length;

  return (
    <div>
      <PageHead title="Missing persons" sub="Reports filed during the response, and their outcome." />

      <Reveal>
        <Panel title="All reports" meta={`${db.missing.length} reports · ${stillMissing} still missing`}>
          {db.missing.length === 0 ? (
            <EmptyState icon={MagnifyingGlass} title="No missing person reports"
              body="Families file reports here; the municipality marks each one found once confirmed." />
          ) : (
            <Table head={[{ label: "ID" }, { label: "Name" }, { label: "Age", num: true },
              { label: "Last seen at" }, { label: "Status" }, { label: "Contact" }, { label: "Filed" }, { label: "Action" }]}>
              {db.missing.map((m) => (
                <Row key={m.id}>
                  <IdCell id={m.id} />
                  <Td className="font-medium">{m.name}</Td>
                  <Td num>{m.age}</Td>
                  <Td>{m.lastSeen}</Td>
                  <Td><Tag status={m.status} /></Td>
                  <Td className="font-mono text-[13px]">{m.contact}</Td>
                  <Td className="font-mono text-[13px]">{m.date}</Td>
                  <Td>
                    {isStaff && m.status === "Missing" ? (
                      <Button size="sm" variant="ink" onClick={() => actions.markFound(m.id)}>
                        Mark found
                      </Button>
                    ) : (
                      <span className="text-line-strong">-</span>
                    )}
                  </Td>
                </Row>
              ))}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isCitizen ? <MissingForm /> : (
        <GatePanel title="File a missing person report"
          roleText="This form is for Citizen accounts. Demo citizen: sita / sita123." />
      )}
    </div>
  );
}
