import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../../schemas/profile.schema";

interface UseSecurityFormOptions {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
}

export function useSecurityForm({ onSubmit }: UseSecurityFormOptions) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword") || "";
  const confirmPassword = watch("confirmPassword") || "";

  // Password checklist checks
  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumberOrSpecial = /[\d!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  const handleValidSubmit = async (data: ChangePasswordFormData) => {
    await onSubmit(data);
    reset();
  };

  return {
    register,
    handleSubmit: handleFormSubmit(handleValidSubmit),
    errors,
    isValid,
    isMinLength,
    hasUppercase,
    hasNumberOrSpecial,
    passwordsMatch,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    reset,
  };
}
