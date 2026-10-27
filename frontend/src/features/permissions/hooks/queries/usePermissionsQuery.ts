import { useState, useCallback } from "react";
import { ApiClient } from "@/lib/api-client";

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export function usePermissionsQuery() {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const permsData = await ApiClient.get<Permission[]>("/permissions");
      setData(permsData);
    } catch (err: any) {
      const errMsg = err?.message || err || "Error al cargar los permisos";
      setError(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
}
