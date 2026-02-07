import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "StockFlow",
  description: "Simple inventory and order management for small businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased`}
      >
        <AuthProvider>
          {children}
        <Toaster richColors position="top-center"/>
        </AuthProvider>
      </body>
    </html>
  );
}
