import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppWrapper } from "@/components/common/PageMeta.tsx";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper>
          {children}
        </AppWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}
