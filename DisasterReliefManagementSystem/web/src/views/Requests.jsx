import { useState } from "react";
import { BowlFood } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Tag, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

const NEEDS = ["Food", "Drinking Water", "Medicine", "Clothes", "Other"];

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
  const pending = db.requests.filter((r) => r.status === "Pending").length;
  const approved = db.requests.filter((r) => r.status === "Approved").length;

  return (
    <div>
      <PageHead title="Relief requests" sub="Needs filed by citizens, moved through approval to delivery." />

      <Reveal>
        <Panel title="Queue" meta={`${db.requests.length} total · ${pending} pending · ${approved} approved`}>
          {db.requests.length === 0 ? (
            <EmptyState icon={BowlFood} title="No requests yet"
              body="Citizens who need food, water, medicine or clothing file their request here." />
          ) : (
            <Table head={[{ label: "ID" }, { label: "Filed by" }, { label: "Location" }, { label: "Need" },
              { label: "Qty", num: true }, { label: "Status" }, { label: "Date" }, { label: "Volunteer" }, { label: "Action" }]}>
              {db.requests.map((r) => {
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
                }
                return (
                  <Row key={r.id}>
                    <IdCell id={r.id} />
                    <Td>{r.citizenName}</Td>
                    <Td>{r.location}</Td>
                    <Td>{r.needType}</Td>
                    <Td num>{r.quantity}</Td>
                    <Td><Tag status={r.status} /></Td>
                    <Td className="font-mono">{r.date}</Td>
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
