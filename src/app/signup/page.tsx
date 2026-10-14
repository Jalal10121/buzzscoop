"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", ...form }),
    });

    const data = await res.json();
    if (res.ok) router.push("/profile");
    else { setError(data.error); setLoading(false); }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-2 text-center">Create Account</h1>
      <p className="text-center text-gray-500 mb-8">Join BuzzScoop — it&apos;s free</p>

      <form onSubmit={submit} className="space-y-4">
        <input type="text" placeholder="Full Name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:border-yellow-400 focus:outline-none" />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:border-yellow-400 focus:outline-none" />
        <input type="password" placeholder="Password" required minLength={6} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:border-yellow-400 focus:outline-none" />
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-black py-3 rounded-lg">
          {loading ? "Creating..." : "Create Account →"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link href="/signin" className="text-yellow-600 font-bold">Sign in</Link>
      </p>
    </main>
  );
}