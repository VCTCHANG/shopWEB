import { Inter, Playfair_Display } from "next/font/google"; // 記得保留原本的字體
import "./globals.css";
import { Header } from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider"; // 👉 加入這行：引入剛剛的 Provider
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
    // 👉 加入 suppressHydrationWarning 避免 Next.js 報錯
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* 👉 把 ThemeProvider 包在這裡，並加上 attribute="class" 給 Tailwind */}
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SmoothScroll>
              <Header />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
