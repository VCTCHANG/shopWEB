import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Group 14. Maison",
  description: "Curated objects for the silence of living.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <SmoothScroll>
                <Header />
                {children}
              </SmoothScroll>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
