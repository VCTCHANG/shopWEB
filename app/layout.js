import { Inter, Playfair_Display } from "next/font/google"; // 記得保留原本的字體
import "./globals.css";
import { Header } from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider"; // 👉 加入這行：引入剛剛的 Provider
import { CartProvider } from "@/lib/CartContext";

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
        <CartProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <SmoothScroll>
              <Header />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
