import "./globals.css";
import { Roboto_Flex } from "next/font/google";

const robotoFlex = Roboto_Flex({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto-flex",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Кабинет автора — Донаты",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={[
          "min-h-dvh bg-[#F2F3F7] text-[#111827]",
          robotoFlex.variable,
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
