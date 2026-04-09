import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Vollkorn } from "next/font/google";
import { Metadata } from "next";

const vollkorn = Vollkorn({
  subsets: ["latin"],
  variable: "--font-vollkorn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxGem | Joyería de Alta Gama",
  description: "Descubre nuestra exclusiva colección de joyería fina. Anillos, collares y brazaletes de lujo que resaltan tu estilo y sofisticación.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`bg-[var(--background)] antialiased ${vollkorn.variable} font-vollkorn`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}