import "@/app/globals.css";
import type { AppProps } from "next/app";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/layout/app-layout";
import { useRouter } from "next/router";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const authRoutes = ["/auth/login", "/auth/register", "/organization-create"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthRoute = authRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  return (
    <div
      className={cn(
        "min-h-full flex flex-col font-sans",
        figtree.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      {isAuthRoute ? (
        <Component {...pageProps} />
      ) : (
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      )}
    </div>
  );
}