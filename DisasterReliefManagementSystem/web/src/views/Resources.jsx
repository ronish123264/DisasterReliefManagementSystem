import { useState } from "react";
import { Package } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

function AddResourceForm() {
  const { actions } = useApp();
  const [form, setForm] = useState({ name: "", quantity: "", unit: "", location: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    actions.addResource({
      name: form.name,
      quantity: parseInt(form.quantity, 10),
      unit: form.unit,
      location: form.location,
    });
    setForm({ name: "", quantity: "", unit: "", location: "" });
  }

  return (
    <Panel title="Add a resource">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Item name" htmlFor="rsName">
          <input id="rsName" className={inputCls} required value={form.name} onChange={set("name")}
            placeholder="Rice bags, water, medicine kits" />
        </Field>
        <Field label="Quantity" htmlFor="rsQuantity">
          <input id="rsQuantity" type="number" min="1" className={inputCls} required value={form.quantity} onChange={set("quantity")} />
        </Field>
        <Field label="Unit" htmlFor="rsUnit">
          <input id="rsUnit" className={inputCls} required value={form.unit} onChange={set("unit")}
            placeholder="bags, bottles, kits, pieces" />
        </Field>
        <Field label="Stored at" htmlFor="rsLocation">
          <input id="rsLocation" className={inputCls} required value={form.location} onChange={set("location")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit">Add resource</Button>
        </div>
      </form>
    </Panel>
  );
}

export default function Resources() {
  const { db, isStaff } = useApp();

  return (
    <div>
      <PageHead title="Resource inventory" sub="Relief stock held in warehouses and stores." />

      <Reveal>
        <Panel title="Stock on hand" meta={`${db.resources.length} line items`}>
          {db.resources.length === 0 ? (
            <EmptyState icon={Package} title="No stock recorded"
              body="Municipality and admin accounts keep the warehouse ledger up to date here." />
          ) : (
            <Table head={[{ label: "ID" }, { label: "Item" }, { label: "Quantity", num: true }, { label: "Stored at" }]}>
              {db.resources.map((r) => (
                <Row key={r.id}>
                  <IdCell id={r.id} />
                  <Td>{r.name}</Td>
                  <Td num>{r.quantity} {r.unit}</Td>
                  <Td>{r.location}</Td>
                </Row>
              ))}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isStaff ? <AddResourceForm /> : <GatePanel title="Add a resource" roleText="This form is for Admin and Municipality accounts." />}
    </div>
  );
}
