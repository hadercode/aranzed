import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiClient } from "@/lib/api-client";
import { AuthCard } from "../components/AuthCard";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await ApiClient.post("/auth/register", {
        email,
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err || "Ocurrió un error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Crear Cuenta"
      subtitle="Únete a Aranzed para comenzar"
      footer={
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
          >
            Iniciar Sesión
          </Link>
        </p>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          Cuenta creada exitosamente. Redirigiendo...
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
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-2.5 px-4 bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
    </AuthCard>
  );
}
