import { useState } from "react";
import { HandCoins } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import GatePanel from "../components/GatePanel.jsx";
import { Panel, Tag, Field, inputCls, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, IdCell, Row } from "../components/table.jsx";

function DonateForm() {
  const { actions, user } = useApp();
  const [type, setType] = useState("Money");
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");

  function submit(e) {
    e.preventDefault();
    if (type === "Money") {
      actions.donate({ type, itemName: "-", amount: parseInt(amount, 10) });
      setAmount("");
    } else {
      actions.donate({ type, itemName: item, amount: 0 });
      setItem("");
    }
  }

  return (
    <Panel title="Make a donation">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <p className="text-sm text-ink-soft sm:col-span-2">Donating as <b className="font-semibold text-ink">{user.fullName}</b></p>
        <Field label="Donation type" htmlFor="dnType">
          <select id="dnType" className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Money">Money</option>
            <option value="Supplies">Supplies</option>
          </select>
        </Field>
        {type === "Money" ? (
          <Field label="Amount, rupees" htmlFor="dnAmount">
            <input id="dnAmount" type="number" min="1" className={inputCls} required value={amount}
              onChange={(e) => setAmount(e.target.value)} />
          </Field>
        ) : (
          <Field label="What are you donating" htmlFor="dnItem">
            <input id="dnItem" className={inputCls} required value={item}
              onChange={(e) => setItem(e.target.value)} placeholder="For example: 20 blankets" />
          </Field>
        )}
        <div className="sm:col-span-2">
          <Button type="submit">Donate</Button>
        </div>
      </form>
    </Panel>
  );
}

export default function Donations() {
  const { db, isCitizen } = useApp();
  const totalMoney = db.donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <PageHead title="Donations" sub="Money and supplies received, tracked to the record." />

      <Reveal>
        <Panel title="Received" meta={`${db.donations.length} records · Rs. ${totalMoney.toLocaleString()} in money`}>
          {db.donations.length === 0 ? (
            <EmptyState icon={HandCoins} title="No donations received"
              body="Money and supply donations are recorded here and counted toward the running total." />
          ) : (
            <Table head={[{ label: "ID" }, { label: "Donor" }, { label: "Type" }, { label: "Item" },
              { label: "Amount", num: true }, { label: "Date" }]}>
              {db.donations.map((d) => (
                <Row key={d.id}>
                  <IdCell id={d.id} />
                  <Td>{d.donorName}</Td>
                  <Td><Tag status={d.type} /></Td>
                  <Td>{d.itemName}</Td>
                  <Td num>{d.amount > 0 ? `Rs. ${d.amount.toLocaleString()}` : "-"}</Td>
                  <Td className="font-mono text-[13px]">{d.date}</Td>
                </Row>
              ))}
            </Table>
          )}
        </Panel>
      </Reveal>

      {isCitizen ? <DonateForm /> : (
        <GatePanel title="Make a donation"
          roleText="This form is for Citizen accounts. Demo citizen: sita / sita123." />
      )}
    </div>
  );
}
