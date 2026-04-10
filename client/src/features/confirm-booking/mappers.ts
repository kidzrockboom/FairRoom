import type { CreateBookingRequest } from "@/api/contracts";
import { formatHour } from "@/lib/utils";
import type { ConfirmBookingFormValues } from "./schemas";

const pad = (n: number) => String(n).padStart(2, "0");

export function toCreateBookingRequest(
  roomId: string,
  date: string,
  slotHour: number,
  values: ConfirmBookingFormValues,
): CreateBookingRequest {
  return {
    roomId,
    startsAt: `${date}T${pad(slotHour)}:00:00`,
    endsAt: `${date}T${pad(slotHour + 1)}:00:00`,
    purpose: values.purpose,
    expectedAttendees: values.expectedAttendees,
  };
}

export function formatSlotRange(slotHour: number): string {
  return `${formatHour(slotHour)} – ${formatHour(slotHour + 1)}`;
}

export function formatBookingDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
