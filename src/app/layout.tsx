import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "RentalCar",
  description: "Car rental application with catalog and car details.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
