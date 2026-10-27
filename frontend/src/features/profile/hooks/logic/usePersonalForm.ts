import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserProfile } from "../queries/useProfileQuery";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "../../schemas/profile.schema";

interface UsePersonalFormOptions {
  profile: UserProfile | null;
  onSubmit: (data: PersonalInfoFormData) => Promise<void>;
}

export function usePersonalForm({ profile, onSubmit }: UsePersonalFormOptions) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      jobTitle: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        jobTitle: profile.jobTitle || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  return {
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    isDirty,
    reset,
  };
}
