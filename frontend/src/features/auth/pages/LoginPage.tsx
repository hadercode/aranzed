import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiClient } from "@/lib/api-client";
import { useAuthStore } from "@/shared/hooks/store/useAuthStore";
import { AuthCard } from "../components/AuthCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await ApiClient.post<{ user: any; token: string }>(
        "/auth/login",
        { email, password },
      );

      setAuth(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError(err || "Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Bienvenido a Aranzed"
      subtitle="Ingresa tus credenciales para continuar"
      footer={
        <p>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
          >
            Regístrate
          </Link>
        </p>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="admin@nexus.com"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-primary)]">
              Contraseña
            </label>
            <Link
              to="/recover-password"
              className="text-xs text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </AuthCard>
  );
}
