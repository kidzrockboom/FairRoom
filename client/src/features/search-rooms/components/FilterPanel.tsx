import PanelFrame from "@/components/ui/panel-frame";
import { Button } from "@/components/ui/button";
import FilterPanelBody from "./FilterPanelBody";
import { useSearchRoomsContext } from "../context";

export default function FilterPanel() {
  const { applyFilters } = useSearchRoomsContext();

  return (
    <PanelFrame as="aside" variant="sidebar">
      <FilterPanelBody />

      <div className="border-t border-border px-6 pb-6 pt-4">
        <Button
          className="h-11 w-full bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </PanelFrame>
  );
}
