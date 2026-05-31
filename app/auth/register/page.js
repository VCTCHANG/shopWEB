"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Register the user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Auto sign-in after successful registration
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      // Registration succeeded but auto sign-in failed — redirect to login
      router.push("/auth/login");
    } else {
      router.push("/shop");
      router.refresh();
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-form">

        <FadeIn delay={0.1}>
          <Link href="/" className="auth-logo">Heirloom.</Link>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="auth-title">
            Create<br />Account.
          </h1>
          <p className="auth-subtitle">Join the collective</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="form-hint">Minimum 8 characters</p>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-solid w-full mt-8"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-center text-sm mt-8" style={{ color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="btn-text" style={{ fontSize: "0.875rem" }}>
              Sign in →
            </Link>
          </p>
        </FadeIn>

      </div>
    </main>
  );
}
