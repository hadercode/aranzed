import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiClient } from "@/lib/api-client";
import { AuthCard } from "../components/AuthCard";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await ApiClient.post("/auth/recover-password", {
        email,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err || "Ocurrió un error al procesar tu solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Recuperar Contraseña"
      subtitle="Ingresa tu correo y te enviaremos instrucciones"
      footer={
        <Link
          to="/login"
          className="text-sm text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
        >
          &larr; Volver a Iniciar Sesión
        </Link>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          Si el correo existe, hemos enviado un enlace para restablecer tu contraseña.
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

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-2.5 px-4 bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Enviando..." : "Enviar Instrucciones"}
        </button>
      </form>
    </AuthCard>
  );
}
