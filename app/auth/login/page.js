"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
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
            Welcome<br />back.
          </h1>
          <p className="auth-subtitle">Sign in to continue</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <form onSubmit={handleSubmit}>
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
                autoComplete="current-password"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-solid w-full mt-8"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="auth-divider">or</div>

          <button
            onClick={() => router.push("/shop")}
            className="btn-outline w-full"
          >
            Continue as Guest
          </button>

          <p className="text-center text-sm mt-8" style={{ color: "var(--muted)" }}>
            No account?{" "}
            <Link href="/auth/register" className="btn-text" style={{ fontSize: "0.875rem" }}>
              Create one →
            </Link>
          </p>
        </FadeIn>

      </div>
    </main>
  );
}
