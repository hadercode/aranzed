import { useState, useCallback, useEffect } from "react";
import { ApiClient } from "@/lib/api-client";
import type { User } from "../../types/user";

export function useUsersQuery() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get<User[]>("/users");
      setData(res);
      setError("");
    } catch (err: any) {
      setError(err || "Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}
