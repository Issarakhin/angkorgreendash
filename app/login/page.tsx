"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email, password, redirect: false,
    });
    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0F1E14" }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #4CAF50 0%, transparent 50%), radial-gradient(circle at 75% 75%, #C9A227 0%, transparent 50%)`
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(46,125,50,0.04) 80px, rgba(46,125,50,0.04) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(46,125,50,0.04) 80px, rgba(46,125,50,0.04) 81px)`
      }} />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #2E7D32, #1B6B3A)", boxShadow: "0 0 40px rgba(46,125,50,0.4)" }}>
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ARIA Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Angkor Green AI Operations</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="admin@angkorgreen.com.kh"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#4CAF50"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#4CAF50"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            {error && (
              <div className="text-xs text-red-400 text-center py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all mt-2"
              style={{ background: loading ? "#1E3A27" : "linear-gradient(135deg, #2E7D32, #1B6B3A)", boxShadow: loading ? "none" : "0 4px 20px rgba(46,125,50,0.35)" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>Cambodia AI Group · ARIA v2.0</p>
      </div>
    </div>
  );
}
