import "./globals.css";

export const metadata = {
  title: "Cosmos — A matter of scale",
  description:
    "Put the universe in perspective. Compare planets, moons and stars in a textured, interactive 3D size laboratory.",
  icons: { icon: "/favicon.svg" },
};

export const viewport = { themeColor: "#0a0e11" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
