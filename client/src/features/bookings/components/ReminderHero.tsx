import { Bell } from "@/lib/icons";

type ReminderHeroProps = {
  roomName: string;
  countdownLabel: string;
};

export default function ReminderHero({ roomName, countdownLabel }: ReminderHeroProps) {
  return (
    <div className="flex flex-col items-center gap-4 bg-primary/5 px-8 py-9 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
        <Bell size={24} strokeWidth={1.5} aria-hidden="true" className="text-primary" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold text-content">Booking Reminder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your session at <span className="font-medium text-content">{roomName}</span>{" "}
          {countdownLabel}.
        </p>
      </div>
    </div>
  );
}
