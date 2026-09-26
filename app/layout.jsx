import "./globals.css";

export const metadata = {
  title: "Planets and Stars",
  applicationName: "Planets and Stars",
  description:
    "Explore Planets and Stars: compare planets, moons, stars and black holes in a textured, interactive 3D size laboratory.",
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
