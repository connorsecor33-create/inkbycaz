import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/archivo-variable.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  ...(site.siteUrl ? { metadataBase: new URL(site.siteUrl) } : {}),
  title: site.seo.title,
  description: site.seo.description,
  ...(site.siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    title: site.seo.title,
    description: site.seo.description,
    siteName: "Inkbycaz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#111110",
  colorScheme: "dark",
};

/* Adds `.motion` only when motion is welcome; removes it if the reveal
   observer hasn't started within 2.5s, so content can never stay hidden. */
const motionScript = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;d.classList.add('motion');setTimeout(function(){if(!window.__revealReady)d.classList.remove('motion')},2500)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
