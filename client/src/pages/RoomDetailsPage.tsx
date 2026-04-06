import { Link } from "react-router-dom";
import { ChevronLeft, iconProps } from "@/lib/icons";
import RoomDetailsInfo from "@/features/search-rooms/components/RoomDetailsInfo";
import RoomAvailabilityPanel from "@/features/search-rooms/components/RoomAvailabilityPanel";

export default function RoomDetailsPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to="/search"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-content"
      >
        <ChevronLeft {...iconProps} aria-hidden="true" />
        Back to Search Results
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <RoomDetailsInfo />
        <RoomAvailabilityPanel />
      </div>
    </div>
  );
}
