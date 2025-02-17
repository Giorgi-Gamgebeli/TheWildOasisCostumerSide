"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ReservationProvider } from "./_context/ReservationContext";

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <ReservationProvider>{children}</ReservationProvider>
      </SessionProvider>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3 * 1000,
          },
          error: {
            duration: 5 * 1000,
          },
          style: {
            fontSize: "18px",
            maxWidth: "700px",
            padding: "16px 24px",
            backgroundColor: "#C69963",
            color: "#2c3d4f",
          },
        }}
      />
    </>
  );
}

export default ClientProviders;
