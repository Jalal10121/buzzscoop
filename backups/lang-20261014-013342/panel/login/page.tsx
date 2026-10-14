"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const [l, setL] = useState(false);
  const router = useRouter();

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setL(true);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) });
    if (res.ok) router.push("/panel-24e075625579/dashboard");
    else { const d = await res.json(); setE(d.error || "Login failed"); setL(false); }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black">BUZZ<span className="text-yellow-500">SCOOP</span></h1>
          <p className="text-gray-500 text-sm mt-1">Admin Login</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input value={u} onChange={e => setU(e.target.value)} required placeholder="Username" className="w-full px-4 py-3 border rounded-lg focus:border-yellow-400 focus:outline-none" />
          <input type="password" value={p} onChange={e => setP(e.target.value)} required placeholder="Password" className="w-full px-4 py-3 border rounded-lg focus:border-yellow-400 focus:outline-none" />
          {e && <p className="text-red-600 text-sm text-center">{e}</p>}
          <button type="submit" disabled={l} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-lg">{l ? "..." : "Login →"}</button>
        </form>
      </div>
    </div>
  );
}