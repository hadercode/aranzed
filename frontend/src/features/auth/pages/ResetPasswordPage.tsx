import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ApiClient } from "@/lib/api-client";
import { AuthCard } from "../components/AuthCard";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("El token de restablecimiento es inválido o no existe.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Token de restablecimiento inválido.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await ApiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err || "Ocurrió un error al restablecer tu contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña"
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

      {success ? (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs text-center">
          Contraseña restablecida exitosamente. Redirigiendo a inicio de sesión...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Nueva Contraseña
            </label>
            <input
              type="password"
              required
              disabled={!token}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-2.5 px-4 bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Restableciendo..." : "Guardar Contraseña"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
