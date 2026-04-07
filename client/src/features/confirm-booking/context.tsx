import { createContext, useContext, type ReactNode } from "react";
import { useConfirmBooking, type ConfirmBookingRouterState } from "./hooks/useConfirmBooking";

type ConfirmBookingContextValue = ReturnType<typeof useConfirmBooking>;

const ConfirmBookingContext = createContext<ConfirmBookingContextValue | null>(null);

type ConfirmBookingProviderProps = ConfirmBookingRouterState & { children: ReactNode };

export function ConfirmBookingProvider({ children, ...routerState }: ConfirmBookingProviderProps) {
  const value = useConfirmBooking(routerState);
  return (
    <ConfirmBookingContext.Provider value={value}>
      {children}
    </ConfirmBookingContext.Provider>
  );
}

export function useConfirmBookingContext() {
  const ctx = useContext(ConfirmBookingContext);
  if (!ctx) throw new Error("useConfirmBookingContext must be used within ConfirmBookingProvider");
  return ctx;
}
