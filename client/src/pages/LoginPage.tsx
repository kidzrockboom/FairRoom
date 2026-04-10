import AuthShell from "@/features/auth/components/AuthShell";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue with bookings, reminders, and your FairRoom workspace."
      promptActionLabel="Create one"
      promptActionTo="/register"
      promptLabel="Need an account?"
    >
      <LoginForm />
    </AuthShell>
  );
}
