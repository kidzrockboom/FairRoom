import { Link } from "react-router-dom";
import { ChevronLeft, iconProps } from "@/lib/icons";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import { RoomDetailsProvider, useRoomDetailsContext } from "@/features/room-details/context";
import RoomDetailsInfo from "@/features/search-rooms/components/RoomDetailsInfo";
import RoomAvailabilityPanel from "@/features/search-rooms/components/RoomAvailabilityPanel";

function RoomDetailsContent() {
  const { room, isLoading, error, retry } = useRoomDetailsContext();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loading size="lg" message="Loading room details..." />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <ErrorBlock
          message={error ?? "Room not found"}
          onRetry={retry}
        />
      </div>
    );
  }

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

export default function RoomDetailsPage() {
  return (
    <RoomDetailsProvider>
      <RoomDetailsContent />
    </RoomDetailsProvider>
  );
}
