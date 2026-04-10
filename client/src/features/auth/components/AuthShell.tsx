import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, CheckCircle, ShieldAlert, iconPropsAction } from "@/lib/icons";

type AuthShellProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  promptLabel: string;
  promptActionLabel: string;
  promptActionTo: string;
}>;

const authHighlights = [
  "Live booking availability",
  "Role-aware workspace access",
  "One account across student and admin flows",
];

export default function AuthShell({
  title,
  subtitle,
  promptLabel,
  promptActionLabel,
  promptActionTo,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(92,63,255,0.08),_transparent_34%),linear-gradient(180deg,_rgba(249,250,251,1),_rgba(255,255,255,1))]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1200px] gap-0 px-5 py-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,480px)] lg:px-8">
        <section className="hidden min-h-[720px] flex-col justify-between rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,rgba(92,63,255,0.10),rgba(92,63,255,0.02))] p-10 lg:flex">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border-3 border-brand-500 bg-brand-50 text-brand-500">
                <DoorOpen {...iconPropsAction} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-heading text-2xl font-semibold tracking-tight text-brand-500">
                  FairRoom
                </p>
                <Badge className="border-border bg-background/80 text-muted-foreground" variant="outline">
                  Campus Room Booking
                </Badge>
              </div>
            </div>

            <div className="max-w-[46ch] space-y-5">
              <p className="font-heading text-[42px] font-semibold leading-[1.02] tracking-tight text-content">
                Book the right room, stay within policy, and keep the flow simple.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                FairRoom brings booking, reminders, account health, and admin operations into one
                consistent system.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {authHighlights.map((highlight, index) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-4 backdrop-blur"
              >
                <div
                  className={
                    index === 1
                      ? "flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
                      : "flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600"
                  }
                >
                  {index === 1 ? (
                    <ShieldAlert {...iconPropsAction} aria-hidden="true" />
                  ) : (
                    <CheckCircle {...iconPropsAction} aria-hidden="true" />
                  )}
                </div>
                <p className="text-sm font-medium text-content">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-[440px] rounded-[28px] border border-border bg-background px-6 py-8 shadow-[0_24px_80px_rgba(17,24,39,0.10)] sm:px-8 sm:py-10">
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex size-11 items-center justify-center rounded-xl border-3 border-brand-500 bg-brand-50 text-brand-500">
                  <DoorOpen {...iconPropsAction} aria-hidden="true" />
                </div>
                <span className="font-heading text-2xl font-semibold tracking-tight text-brand-500">
                  FairRoom
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-heading text-[32px] font-semibold tracking-tight text-content">
                  {title}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            {children}

            <p className="mt-6 text-sm text-muted-foreground">
              {promptLabel}{" "}
              <Link className="font-semibold text-brand-500 hover:text-brand-600" to={promptActionTo}>
                {promptActionLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
