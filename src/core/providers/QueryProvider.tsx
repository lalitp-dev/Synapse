import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Senior Tip: Data is considered "fresh" for 5 minutes.
      // This prevents unnecessary API calls to Supabase if the user
      // switches tabs and comes back quickly.
      staleTime: 1000 * 60 * 5,
      retry: 2, // Retry failed requests twice before showing an error
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
