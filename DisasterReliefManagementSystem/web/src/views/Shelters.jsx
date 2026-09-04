import { useState } from "react";
import { House } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

function AddShelterForm() {
  const { actions } = useApp();
  const [form, setForm] = useState({ name: "", location: "", capacity: "", occupied: "0", contact: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    actions.addShelter({
      name: form.name,
      location: form.location,
      capacity: parseInt(form.capacity, 10),
      occupied: parseInt(form.occupied || "0", 10),
      contact: form.contact,
    });
    setForm({ name: "", location: "", capacity: "", occupied: "0", contact: "" });
  }

  return (
    <Panel title="Add a shelter">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Shelter name" htmlFor="shName">
          <input id="shName" className={inputCls} required value={form.name} onChange={set("name")}
            placeholder="School, community hall, campus" />
        </Field>
        <Field label="Location" htmlFor="shLocation">
          <input id="shLocation" className={inputCls} required value={form.location} onChange={set("location")} />
        </Field>
        <Field label="Capacity, people" htmlFor="shCapacity">
          <input id="shCapacity" type="number" min="1" className={inputCls} required value={form.capacity} onChange={set("capacity")} />
        </Field>
        <Field label="Currently occupied" htmlFor="shOccupied">
          <input id="shOccupied" type="number" min="0" className={inputCls} required value={form.occupied} onChange={set("occupied")} />
        </Field>
        <Field label="Contact phone" htmlFor="shContact">
          <input id="shContact" className={inputCls} required value={form.contact} onChange={set("contact")} />
        </Field>
        <div className="flex items-end">
          <Button type="submit">Add shelter</Button>
        </div>
      </form>
    </Panel>
  );
}

export default function Shelters() {
  const { db, isStaff } = useApp();
  const totalFree = db.shelters.reduce((sum, s) => sum + (s.capacity - s.occupied), 0);
  const atCapacity = db.shelters.filter((s) => s.capacity - s.occupied === 0).length;

  return (
    <div>
      <PageHead title="Shelters" sub="Capacity, occupancy and free space for every registered shelter." />

      <Reveal>
        <Panel
          title="All shelters"
          meta={`${db.shelters.length} shelters · ${totalFree} places free${atCapacity ? `, ${atCapacity} at capacity` : ""}`}
        >
          {db.shelters.length === 0 ? (
            <EmptyState icon={House} title="No shelters registered"
              body="Municipality and admin accounts can register shelters with their capacity and contact." />
          ) : (
            <Table head={[{ label: "ID" }, { label: "Name" }, { label: "Location" },
              { label: "Capacity", num: true }, { label: "Occupied", num: true }, { label: "Free", num: true },
              { label: "Contact" }]}>
              {db.shelters.map((s) => {
                const free = s.capacity - s.occupied;
                return (
                  <Row key={s.id}>
                    <IdCell id={s.id} />
                    <Td>{s.name}</Td>
                    <Td>{s.location}</Td>
                    <Td num>{s.capacity}</Td>
                    <Td num>{s.occupied}</Td>
                    <Td num className={free === 0 ? "font-semibold text-st-bad" : "font-semibold"}>
                      {free === 0 ? "full" : free}
                    </Td>
                    <Td className="font-mono">{s.contact}</Td>
                  </Row>
                );
              })}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isStaff ? <AddShelterForm /> : <GatePanel title="Add a shelter" roleText="This form is for Admin and Municipality accounts." />}
    </div>
  );
}
