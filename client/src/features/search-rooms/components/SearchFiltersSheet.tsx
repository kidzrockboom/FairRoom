import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Filter, iconProps } from "@/lib/icons";
import { useSearchRoomsContext } from "../context";
import FilterPanelBody from "./FilterPanelBody";

type SearchFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SearchFiltersSheet({ open, onOpenChange }: SearchFiltersSheetProps) {
  const { applyFilters } = useSearchRoomsContext();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(90vw,22rem)] max-w-none p-0" showCloseButton>
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-content">
            <Filter {...iconProps} aria-hidden="true" />
            Filters
          </SheetTitle>
          <SheetDescription>Adjust room search criteria.</SheetDescription>
        </SheetHeader>

        <FilterPanelBody className="min-h-0 flex-1" />

        <div className="border-t border-border px-6 pb-6 pt-4">
          <Button
            className="h-11 w-full bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600"
            onClick={() => {
              applyFilters();
              onOpenChange(false);
            }}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
