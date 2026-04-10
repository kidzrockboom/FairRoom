import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getHomePathForRole } from "@/features/session/navigation";
import { useSession } from "@/features/session/useSession";
import { registerSchema, type RegisterFormValues } from "../schemas";

export function useRegisterForm() {
  const navigate = useNavigate();
  const { register: registerAccount } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const user = await registerAccount({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      navigate(getHomePathForRole(user.role), { replace: true });
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create account");
    }
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    submitError,
    onSubmit,
  };
}
