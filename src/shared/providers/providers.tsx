import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReduxProvider>
    </>
  );
}
