import AuthShell from "@/features/auth/components/AuthShell";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Register once, then FairRoom will route you into the right student or admin workspace."
      promptActionLabel="Sign in"
      promptActionTo="/login"
      promptLabel="Already have an account?"
    >
      <RegisterForm />
    </AuthShell>
  );
}
