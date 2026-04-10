import { SearchRoomsProvider } from "@/features/search-rooms/context";
import FilterPanel from "@/features/search-rooms/components/FilterPanel";
import ResultsPanel from "@/features/search-rooms/components/ResultsPanel";

export default function SearchRoomsPage() {
  return (
    <SearchRoomsProvider>
      <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
        <FilterPanel />
        <ResultsPanel />
      </div>
    </SearchRoomsProvider>
  );
}
