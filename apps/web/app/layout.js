import './globals.css';

const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://malayalimed.com';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'MalayaliMed — Kerala Healthcare', template: '%s · MalayaliMed' },
  description: "Kerala's trusted digital healthcare portal — find doctors, hospitals, and book appointments."
};
export const viewport = { themeColor: '#0d9488', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <body>{children}</body>
    </html>
  );
}
