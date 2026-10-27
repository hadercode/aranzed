import { useState } from "react";
import { ApiClient } from "@/lib/api-client";
import type { User } from "../../types/user";

interface CreateUserData {
  email: string;
  password?: string;
  roles?: string[];
}

interface UpdateUserData {
  email?: string;
  password?: string;
  roles?: string[];
}

interface UseUserMutationsOptions {
  onSuccess?: () => void;
}

export function useUserMutations(options?: UseUserMutationsOptions) {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState("");

  const execute = async <T>(action: () => Promise<T>): Promise<T> => {
    setIsMutating(true);
    setMutationError("");
    try {
      const res = await action();
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return res;
    } catch (err: any) {
      setMutationError(err || "Error en la operación de usuario");
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const createUser = (data: CreateUserData) =>
    execute(() => ApiClient.post<User>("/users", data));

  const updateUser = (id: string, data: UpdateUserData) =>
    execute(() => ApiClient.put<User>(`/users/${id}`, data));

  const deleteUser = (id: string) =>
    execute(() => ApiClient.delete(`/users/${id}`));

  return {
    createUser,
    updateUser,
    deleteUser,
    isMutating,
    mutationError,
    setMutationError,
  };
}
