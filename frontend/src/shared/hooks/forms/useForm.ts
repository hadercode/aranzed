import { useState, useCallback } from 'react';

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback((newValues?: Partial<T>) => {
    setValues(() => ({ ...initialValues, ...newValues } as T));
  }, [initialValues]);

  return { values, setValues, handleChange, resetForm };
}
