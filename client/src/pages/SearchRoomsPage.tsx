import SearchRoomsFilterPanel from "@/features/search-rooms/components/SearchRoomsFilterPanel";
import SearchRoomsResultsPanel from "@/features/search-rooms/components/SearchRoomsResultsPanel";

export default function SearchRoomsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
      <SearchRoomsFilterPanel />
      <SearchRoomsResultsPanel />
    </div>
  );
}
