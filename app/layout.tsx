import type { Metadata } from "next";
import "./styles/palette.css";
import "./styles/base.css";
import "./styles/site.css";

export const metadata: Metadata = {
  title: "Banana Mobile — Official Android Downloads",
  description: "Download the latest official Banana Android app release.",
  applicationName: "Banana Mobile",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
