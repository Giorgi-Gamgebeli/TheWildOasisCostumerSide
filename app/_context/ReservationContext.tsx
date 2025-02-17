"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ReservationContextTypes = {
  range: { from: Date | undefined; to: Date | undefined };
  setRange: Dispatch<
    SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
  resetRange: () => void;
};

const ReservationContext = createContext<ReservationContextTypes | null>(null);

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (context === null)
    throw new Error("Reservation context was used outside provider");

  return context;
}

export { ReservationProvider, useReservation };
