import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { AmenityResponse, AdminRoomResponse } from "@/api/contracts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

import {
  buildInventoryRoomFormValues,
} from "@/features/admin/inventory/adminInventoryMappers";
import { createAmenitySchema, inventoryRoomSchema, type InventoryRoomFormValues } from "@/features/admin/inventory/schemas";

type InventoryRoomFormMode = "add" | "edit";

type InventoryRoomFormProps = {
  mode: InventoryRoomFormMode;
  room?: AdminRoomResponse | null;
  amenityOptions: AmenityResponse[];
  isSubmitting: boolean;
  error: string | null;
  onCancel: () => void;
  onCreateAmenity: (label: string) => Promise<AmenityResponse>;
  onSubmit: (values: InventoryRoomFormValues) => Promise<void>;
};

export default function InventoryRoomForm({
  mode,
  room,
  amenityOptions,
  error,
  isSubmitting,
  onCancel,
  onCreateAmenity,
  onSubmit,
}: InventoryRoomFormProps) {
  const isEditMode = mode === "edit";
  const actionLabel = isEditMode ? "Save Changes" : "Create Room";
  const title = isEditMode ? "Edit Room" : "Register New Room";
  const [amenityLabel, setAmenityLabel] = useState("");
  const [amenityError, setAmenityError] = useState<string | null>(null);
  const form = useForm<InventoryRoomFormValues>({
    resolver: zodResolver(inventoryRoomSchema) as Resolver<InventoryRoomFormValues>,
    defaultValues: buildInventoryRoomFormValues(room),
  });

  const { handleSubmit, register, setValue, control, formState } = form;
  const selectedAmenityIds = useWatch({
    control,
    name: "amenityIds",
  }) ?? [];
  const status = useWatch({
    control,
    name: "status",
  }) ?? "operational";

  async function handleCreateAmenity() {
    const parsed = createAmenitySchema.safeParse({ label: amenityLabel });
    if (!parsed.success) {
      setAmenityError(parsed.error.issues[0]?.message ?? "Amenity label is required");
      return;
    }

    setAmenityError(null);

    try {
      const amenity = await onCreateAmenity(parsed.data.label);
      const nextIds = selectedAmenityIds.includes(amenity.id)
        ? selectedAmenityIds
        : [...selectedAmenityIds, amenity.id];
      setValue("amenityIds", nextIds, { shouldDirty: true, shouldTouch: true });
      setAmenityLabel("");
    } catch (error: unknown) {
      setAmenityError(error instanceof Error ? error.message : "Failed to add amenity.");
    }
  }

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={handleSubmit((values) => {
        void onSubmit(values);
      })}
    >
      <div className="border-b border-border px-4 py-4">
        <h2 className="font-heading text-[22px] font-bold tracking-tight text-content">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the details below to {isEditMode ? "update the room record" : "add a new bookable room"}.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-content" htmlFor="roomCode">
              Room Code
            </label>
            <Input
              id="roomCode"
              placeholder="e.g., RM-402"
              {...register("roomCode")}
            />
            {formState.errors.roomCode && (
              <p className="text-xs text-destructive">{formState.errors.roomCode.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-content" htmlFor="name">
              Room Name
            </label>
            <Input id="name" placeholder="e.g., Seminar Room 402" {...register("name")} />
            {formState.errors.name && (
              <p className="text-xs text-destructive">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-content" htmlFor="location">
                Location
              </label>
              <Input
                id="location"
                placeholder="e.g., Block B, Floor 2"
                {...register("location")}
              />
              {formState.errors.location && (
                <p className="text-xs text-destructive">{formState.errors.location.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-content" htmlFor="capacity">
                Capacity
              </label>
              <Input
                id="capacity"
                inputMode="numeric"
                placeholder="0"
                type="number"
                {...register("capacity")}
              />
              {formState.errors.capacity && (
                <p className="text-xs text-destructive">{formState.errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-content" htmlFor="status">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => {
                setValue("status", value as "operational" | "disabled", {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.status && (
              <p className="text-xs text-destructive">{formState.errors.status.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-content" htmlFor="usageNotes">
              Usage Notes
            </label>
            <textarea
              id="usageNotes"
              className={cn(
                "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-content outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
              placeholder="Optional note for students and admins"
              {...register("usageNotes")}
            />
            {formState.errors.usageNotes && (
              <p className="text-xs text-destructive">{formState.errors.usageNotes.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-content">Amenities</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {amenityOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 text-sm text-content",
                    selectedAmenityIds.includes(option.id) ? "font-medium" : "font-normal",
                  )}
                >
                  <Checkbox
                    checked={selectedAmenityIds.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const nextIds = checked
                        ? [...selectedAmenityIds, option.id]
                        : selectedAmenityIds.filter((id) => id !== option.id);
                      setValue("amenityIds", nextIds, { shouldDirty: true, shouldTouch: true });
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="rounded-card border border-border bg-muted/15 px-3 py-3">
              <div className="flex items-start gap-2">
                <Info {...iconProps} aria-hidden="true" className="mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Add a new amenity and it will become available to the room inventory right away.
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <Input
                  aria-label="New amenity"
                  placeholder="e.g., Whiteboard"
                  value={amenityLabel}
                  onChange={(event) => {
                    setAmenityError(null);
                    setAmenityLabel(event.target.value);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 px-3"
                  onClick={() => {
                    void handleCreateAmenity();
                  }}
                >
                  <Plus aria-hidden="true" />
                  Add
                </Button>
              </div>
              {amenityError && <p className="mt-2 text-xs text-destructive">{amenityError}</p>}
            </div>
          </div>

          {error && (
            <div className="rounded-card border border-destructive/30 bg-destructive/5 px-3 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4 text-sm font-semibold shadow-none"
            onClick={onCancel}
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            className="h-9 px-4 text-sm font-semibold"
            disabled={isSubmitting || formState.isSubmitting}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
