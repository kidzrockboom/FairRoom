import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "@/lib/icons";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginForm() {
  const { register, errors, isSubmitting, submitError, onSubmit } = useLoginForm();

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
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

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-content" htmlFor="password">
            Password
          </label>
          <Link className="text-xs font-semibold text-brand-500 hover:text-brand-600" to="/register">
            Need access?
          </Link>
        </div>
        <Input
          autoComplete="current-password"
          id="password"
          placeholder="Enter your password"
          type="password"
          {...register("password")}
          aria-invalid={Boolean(errors.password)}
          className="h-11 rounded-xl px-3"
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      {submitError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/6 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button className="h-11 w-full justify-center rounded-xl" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign In"}
        {!isSubmitting && <ArrowRight aria-hidden="true" className="size-4" />}
      </Button>

      <Separator />

      <p className="text-xs leading-5 text-muted-foreground">
        Use the account issued for your FairRoom role. Access is controlled after sign-in from your
        backend role profile.
      </p>
    </form>
  );
}
