import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getHomePathForRole } from "@/features/session/navigation";
import { useSession } from "@/features/session/useSession";
import { loginSchema, type LoginFormValues } from "../schemas";

export function useLoginForm() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const user = await signIn(values);
      navigate(getHomePathForRole(user.role), { replace: true });
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Failed to sign in");
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
