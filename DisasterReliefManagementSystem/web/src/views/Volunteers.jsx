import { UsersThree } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import { Panel, Tag, Button, EmptyState, Reveal } from "../components/ui.jsx";
import { Table, Td, Row } from "../components/table.jsx";

export default function Volunteers() {
  const { db, isVolunteer, user, actions, showSection } = useApp();
  const volunteers = db.users.filter((u) => u.role === "VOLUNTEER");
  const available = volunteers.filter((v) => v.availability === "Available").length;

  return (
    <div>
      <PageHead title="Volunteers" sub="Registered responders and what they can do." />

      {isVolunteer && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="text-sm text-ink-soft">
              Your current availability: <b className="font-semibold text-ink">{user.availability}</b>
            </p>
            <span className="flex gap-2">
              <Button size="sm" variant={user.availability === "Available" ? "ink" : "line"}
                onClick={() => actions.setAvailability("Available")}>
                Mark available
              </Button>
              <Button size="sm" variant={user.availability === "Busy" ? "ink" : "line"}
                onClick={() => actions.setAvailability("Busy")}>
                Mark busy
              </Button>
            </span>
          </div>
        </Panel>
      )}

      <Reveal>
        <Panel title="Roster" meta={`${volunteers.length} registered · ${available} available`}>
          {volunteers.length === 0 ? (
            <EmptyState icon={UsersThree} title="No volunteers registered"
              body="Responders sign up as volunteers, then claim relief requests from the queue." >
              <Button variant="line" onClick={() => showSection("login")}>Register as a volunteer</Button>
            </EmptyState>
          ) : (
            <Table head={[{ label: "Name" }, { label: "Username" }, { label: "Skills" }, { label: "Phone" }, { label: "Availability" }]}>
              {volunteers.map((v) => (
                <Row key={v.id}>
                  <Td className="font-medium">{v.fullName}</Td>
                  <Td className="font-mono text-[13px]">{v.username}</Td>
                  <Td>{v.skills}</Td>
                  <Td className="font-mono text-[13px]">{v.phone}</Td>
                  <Td><Tag status={v.availability} /></Td>
                </Row>
              ))}
            </Table>
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
