import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { fairroomApi } from "@/api/fairroomApi";
import type { Room } from "@/api/contracts";
import { createConfirmBookingSchema, type ConfirmBookingFormValues } from "../schemas";
import { toCreateBookingRequest } from "../mappers";
import { submitBooking } from "../confirmBookingService";

export type ConfirmBookingRouterState = {
  roomId: string;
  date: string;
  slotHour: number;
};

export function useConfirmBooking({ roomId, date, slotHour }: ConfirmBookingRouterState) {
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoadingRoom(true);
      setRoomError(null);

      try {
        const fetched = await fairroomApi.getRoom(roomId);
        if (!cancelled) setRoom(fetched);
      } catch (err: unknown) {
        if (!cancelled) {
          setRoomError(err instanceof Error ? err.message : "Failed to load room");
        }
      } finally {
        if (!cancelled) setIsLoadingRoom(false);
      }
    })();

    return () => { cancelled = true; };
  }, [roomId]);

  const form = useForm<ConfirmBookingFormValues>({
    resolver: zodResolver(createConfirmBookingSchema(room?.capacity ?? 99)),
    defaultValues: { purpose: "", expectedAttendees: 1 },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const payload = toCreateBookingRequest(roomId, date, slotHour, values);
      const booking = await submitBooking(payload);
      navigate("/bookings/reminder", { state: { booking } });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create booking");
    }
  });

  return {
    room,
    date,
    slotHour,
    isLoadingRoom,
    roomError,
    submitError,
    isSubmitting: form.formState.isSubmitting,
    register: form.register,
    errors: form.formState.errors,
    onSubmit,
  };
}
