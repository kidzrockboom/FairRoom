import SearchRoomsFilterPanel from "@/features/search-rooms/components/SearchRoomsFilterPanel";
import SearchRoomsResultsPanel from "@/features/search-rooms/components/SearchRoomsResultsPanel";

export default function SearchRoomsPage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <SearchRoomsFilterPanel />
      <SearchRoomsResultsPanel />
    </div>
  );
}
