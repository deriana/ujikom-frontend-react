import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/components/common/PageMeta";

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppWrapper>
  );
}
