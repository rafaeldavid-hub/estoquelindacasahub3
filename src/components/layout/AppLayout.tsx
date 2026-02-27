import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useTheme } from "@/hooks/useTheme";

export function AppLayout({ children }: { children: ReactNode }) {
  // read env var injected by Vite (prefix VITE_ required)
  // defaults for white/dark theme backgrounds so there's something even if
  // no env variables are supplied.
  const defaultLight = "https://i.ibb.co/DDd6NyWT/13312754-v800-mynt-21.jpg";
  const defaultDark = "https://i.ibb.co/DfnCCRsZ/102381.jpg"; // replace if you have one

  // read both light and dark URLs from env; VITE_BACKGROUND_URL still accepted
  // as an alias for the light image for backward compatibility.
  const lightUrl =
    (import.meta.env.VITE_BACKGROUND_URL_LIGHT as string | undefined) ||
    (import.meta.env.VITE_BACKGROUND_URL as string | undefined) ||
    defaultLight;
  const darkUrl =
    (import.meta.env.VITE_BACKGROUND_URL_DARK as string | undefined) ||
    (import.meta.env.VITE_BACKGROUND_URL as string | undefined) ||
    defaultDark;

  const { theme } = useTheme();
  const bgUrl = theme === "dark" ? darkUrl : lightUrl;

  const mainStyle: React.CSSProperties = {
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-transition" style={mainStyle}>
        <div className="container mx-auto px-4 sm:px-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
