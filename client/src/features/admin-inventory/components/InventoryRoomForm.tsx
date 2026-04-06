import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Info, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

import type { InventoryRoom } from "@/features/admin-inventory/adminInventoryContent";
import { inventoryAmenityOptions } from "@/features/admin-inventory/adminInventoryContent";

type InventoryRoomFormMode = "add" | "edit";

type InventoryRoomFormValues = {
  roomName: string;
  buildingFloor: string;
  capacity: string;
  amenityIds: string[];
};

type InventoryRoomFormProps = {
  mode: InventoryRoomFormMode;
  room?: InventoryRoom | null;
  onClose: () => void;
};

function getInitialValues(room: InventoryRoom | null | undefined): InventoryRoomFormValues {
  return room
    ? {
        roomName: room.name,
        buildingFloor: room.location,
        capacity: String(room.capacity),
        amenityIds: room.tags
          .map((tag) => inventoryAmenityOptions.find((option) => option.label === tag)?.id)
          .filter((id): id is string => Boolean(id)),
      }
    : {
        roomName: "",
        buildingFloor: "",
        capacity: "",
        amenityIds: ["projector", "ac", "whiteboard"],
      };
}

export default function InventoryRoomForm({ mode, room, onClose }: InventoryRoomFormProps) {
  const [values, setValues] = useState<InventoryRoomFormValues>(() => getInitialValues(room));

  useEffect(() => {
    setValues(getInitialValues(room));
  }, [room]);

  const isEditMode = mode === "edit";
  const actionLabel = isEditMode ? "Save Changes" : "Create Room";
  const title = isEditMode ? "Edit Room" : "Register New Room";

  function toggleAmenity(id: string) {
    setValues((current) => ({
      ...current,
      amenityIds: current.amenityIds.includes(id)
        ? current.amenityIds.filter((amenityId) => amenityId !== id)
        : [...current.amenityIds, id],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose();
  }

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="border-b border-border px-4 py-4">
        <h2 className="font-heading text-[22px] font-bold tracking-tight text-content">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the details below to {isEditMode ? "update the room record" : "add a new bookable room"}.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-content" htmlFor="roomName">
              Room Name / Number
            </label>
            <Input
              id="roomName"
              placeholder="e.g., Seminar Room 402"
              value={values.roomName}
              onChange={(event) =>
                setValues((current) => ({ ...current, roomName: event.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-content" htmlFor="buildingFloor">
                Building/Floor
              </label>
              <Input
                id="buildingFloor"
                placeholder="e.g., Block B, Floor 2"
                value={values.buildingFloor}
                onChange={(event) =>
                  setValues((current) => ({ ...current, buildingFloor: event.target.value }))
                }
              />
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
                value={values.capacity}
                onChange={(event) =>
                  setValues((current) => ({ ...current, capacity: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-content">Amenities</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {inventoryAmenityOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 text-sm text-content",
                    values.amenityIds.includes(option.id) ? "font-medium" : "font-normal",
                  )}
                >
                  <Checkbox
                    checked={values.amenityIds.includes(option.id)}
                    onCheckedChange={() => toggleAmenity(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-muted/15 px-3 py-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Info {...iconProps} aria-hidden="true" className="mt-0.5 shrink-0" />
              <p>
                By registering this room, it will be immediately visible to students for booking unless you disable it after saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" className="h-9 px-4 text-sm font-semibold shadow-none" onClick={onClose}>
            Discard Changes
          </Button>
          <Button type="submit" className="h-9 px-4 text-sm font-semibold">
            {actionLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
