import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import PageHead from "../components/PageHead.jsx";
import { Panel, Field, inputCls, Button } from "../components/ui.jsx";
import { Table, Td } from "../components/table.jsx";

function LoginForm() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!login(username.trim(), password)) {
      setError("Wrong username or password.");
    }
  }

  return (
    <Panel title="Login">
      <form onSubmit={submit} className="grid gap-4 p-5">
        <Field label="Username" htmlFor="loginUsername">
          <input id="loginUsername" className={inputCls} autoComplete="username" required
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="loginPassword">
          <input id="loginPassword" type="password" className={inputCls} autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div>
          <Button type="submit">Login</Button>
        </div>
        {error && <p role="alert" className="text-[13px] font-medium text-accent">{error}</p>}
      </form>
    </Panel>
  );
}

function RegisterForm() {
  const { register } = useApp();
  const [form, setForm] = useState({
    role: "CITIZEN", fullName: "", address: "", skills: "", phone: "", username: "", password: "",
  });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    setError("");
    const draft = {
      role: form.role,
      username: form.username.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      district: "",
      availability: "Available",
      skills: form.role === "VOLUNTEER" ? form.skills.trim() : "",
      address: form.role === "CITIZEN" ? form.address.trim() : "",
    };
    const problem = register(draft);
    if (problem) setError(problem);
  }

  return (
    <Panel title="Create an account">
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Account type" htmlFor="regRole">
          <select id="regRole" className={inputCls} value={form.role} onChange={set("role")}>
            <option value="CITIZEN">Citizen</option>
            <option value="VOLUNTEER">Volunteer</option>
          </select>
        </Field>
        <Field label="Full name" htmlFor="regFullName">
          <input id="regFullName" className={inputCls} required value={form.fullName} onChange={set("fullName")} />
        </Field>
        {form.role === "CITIZEN" ? (
          <Field label="Address" htmlFor="regAddress">
            <input id="regAddress" className={inputCls} value={form.address} onChange={set("address")} />
          </Field>
        ) : (
          <Field label="Skills" htmlFor="regSkills">
            <input id="regSkills" className={inputCls} value={form.skills} onChange={set("skills")}
              placeholder="First aid, driving, cooking" />
          </Field>
        )}
        <Field label="Phone" htmlFor="regPhone">
          <input id="regPhone" className={inputCls} required value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Username" htmlFor="regUsername">
          <input id="regUsername" className={inputCls} autoComplete="off" required value={form.username} onChange={set("username")} />
        </Field>
        <Field label="Password" htmlFor="regPassword">
          <input id="regPassword" type="password" className={inputCls} autoComplete="new-password" required
            value={form.password} onChange={set("password")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit">Create account</Button>
        </div>
        {error && <p role="alert" className="text-[13px] font-medium text-accent sm:col-span-2">{error}</p>}
      </form>
    </Panel>
  );
}

export default function Login() {
  const { user, logout } = useApp();

  return (
    <div>
      <PageHead title="Access" sub="Login or register to file reports and move work through the queue." />

      {user ? (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
            <p className="text-sm text-ink-soft">
              Logged in as <b className="font-semibold text-ink">{user.fullName}</b> ({user.role}).
            </p>
            <Button variant="line" onClick={logout}>Log out</Button>
          </div>
        </Panel>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <LoginForm />
          <RegisterForm />
        </div>
      )}

      <Panel title="Demo accounts" meta="Seeded on first run">
        <Table head={[{ label: "Role" }, { label: "Username" }, { label: "Password" }, { label: "Scope" }]}>
          <tr>
            <Td>Admin</Td><Td className="font-mono text-[13px]">admin</Td>
            <Td className="font-mono text-[13px]">admin123</Td><Td>Everything, plus the summary</Td>
          </tr>
          <tr>
            <Td>Municipality</Td><Td className="font-mono text-[13px]">municipality</Td>
            <Td className="font-mono text-[13px]">muni123</Td><Td>Shelters, stock, approvals, status</Td>
          </tr>
          <tr>
            <Td>Volunteer</Td><Td className="font-mono text-[13px]">ramvol</Td>
            <Td className="font-mono text-[13px]">ram123</Td><Td>Claim requests, set availability</Td>
          </tr>
          <tr>
            <Td>Citizen</Td><Td className="font-mono text-[13px]">sita</Td>
            <Td className="font-mono text-[13px]">sita123</Td><Td>Reports, requests, donations</Td>
          </tr>
        </Table>
      </Panel>
    </div>
  );
}
