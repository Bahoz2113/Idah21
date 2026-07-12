"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, makeLinks } from "@cezeri/trpc";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({ links: makeLinks("/api/trpc") }));

  // TTFD olcumu (loop-mrgp6m54-2963ab / T1): sadece localStorage.ttfd==="1" iken
  // queryClient'i console'a acar ki olcum scripti cold fetch'i zorlayabilsin. Production-etkisiz.
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("ttfd") === "1") {
      (window as any).__qc = queryClient;
    }
  }, [queryClient]);
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
