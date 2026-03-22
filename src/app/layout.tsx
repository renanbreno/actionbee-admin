import type { Metadata } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/query-provider";
import { AuthProvider } from "@/contexts/auth/presentation/providers/auth-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const isProduction = process.env.NODE_ENV === "production";
const iconUrl = isProduction ? "https://actionbee.com.br/icon.png" : "/icon.png";
const appleIconUrl = isProduction ? "https://actionbee.com.br/apple-icon.png" : "/apple-icon.png";

const METADATA_BY_DOMAIN: Record<string, Metadata> = {
  // Adicione aqui os domínios e seus respectivos metadados
  admin: {
    title: "ActionBee Admin",
    description: "Admin panel for ActionBee ecommerce",
    icons: {
      icon: [
        { url: iconUrl, sizes: "32x32", type: "image/png" },
        { url: appleIconUrl, sizes: "180x180", type: "image/png" },
      ],
      apple: [
        { url: appleIconUrl, sizes: "180x180", type: "image/png" },
      ],
    },
  },
  affiliate: {
    title: "ActionBee Afiliados",
    description: "Portal de afiliados da ActionBee",
    icons: {
      icon: [
        { url: iconUrl, sizes: "32x32", type: "image/png" },
        { url: appleIconUrl, sizes: "180x180", type: "image/png" },
      ],
      apple: [
        { url: appleIconUrl, sizes: "180x180", type: "image/png" },
      ],
    },
  },
};

const DOMAIN_CONFIG: Record<string, keyof typeof METADATA_BY_DOMAIN> = {
  // Configure aqui qual domínio aponta para qual tipo de aplicação
  // Exemplo: "admin.actionbee.com.br": "admin", "afiliados.actionbee.com.br": "affiliate"
  // Em localhost, usamos o caminho da URL para determinar
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Detecta se está na rota /affiliate pelo referer ou caminho inicial
  const referer = headersList.get("referer") || "";
  const isAffiliateRoute = referer.includes("/affiliate");

  // Em dev/local, usamos o caminho para determinar
  // Em produção, você deve configurar os domínios reais em DOMAIN_CONFIG
  let metadataKey: keyof typeof METADATA_BY_DOMAIN = "admin";

  if (DOMAIN_CONFIG[host]) {
    metadataKey = DOMAIN_CONFIG[host];
  } else if (isAffiliateRoute || host.includes("afiliado") || host.includes("affiliate")) {
    metadataKey = "affiliate";
  }

  return METADATA_BY_DOMAIN[metadataKey] || METADATA_BY_DOMAIN.admin;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
