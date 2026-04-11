import { useEffect, useState } from "react";
import { SearchRoomsProvider } from "@/features/search-rooms/context";
import FilterPanel from "@/features/search-rooms/components/FilterPanel";
import SearchFiltersSheet from "@/features/search-rooms/components/SearchFiltersSheet";
import ResultsPanel from "@/features/search-rooms/components/ResultsPanel";

export default function SearchRoomsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (media.matches) setFiltersOpen(false);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <SearchRoomsProvider>
      <div className="flex flex-1 flex-col bg-background lg:min-h-full lg:flex-row lg:items-stretch">
        <div className="hidden lg:block">
          <FilterPanel />
        </div>
        <SearchFiltersSheet open={filtersOpen} onOpenChange={setFiltersOpen} />
        <ResultsPanel onOpenFilters={() => setFiltersOpen(true)} />
      </div>
    </SearchRoomsProvider>
  );
}
