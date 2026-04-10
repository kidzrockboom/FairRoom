import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "@/lib/icons";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function RegisterForm() {
  const { register, errors, isSubmitting, submitError, onSubmit } = useRegisterForm();

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-content" htmlFor="fullName">
          Full name
        </label>
        <Input
          autoComplete="name"
          id="fullName"
          placeholder="Jane Doe"
          {...register("fullName")}
          aria-invalid={Boolean(errors.fullName)}
          className="h-11 rounded-xl px-3"
        />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-content" htmlFor="email">
          Email
        </label>
        <Input
          autoComplete="email"
          id="email"
          placeholder="you@school.edu"
          type="email"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
          className="h-11 rounded-xl px-3"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-content" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="new-password"
            id="password"
            placeholder="At least 8 characters"
            type="password"
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
            className="h-11 rounded-xl px-3"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-content" htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input
            autoComplete="new-password"
            id="confirmPassword"
            placeholder="Repeat your password"
            type="password"
            {...register("confirmPassword")}
            aria-invalid={Boolean(errors.confirmPassword)}
            className="h-11 rounded-xl px-3"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {submitError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/6 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button className="h-11 w-full justify-center rounded-xl" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account..." : "Create Account"}
        {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
      </Button>

      <Separator />

      <p className="text-xs leading-5 text-muted-foreground">
        Registration signs you in immediately after the backend accepts your account details.
      </p>
    </form>
  );
}
