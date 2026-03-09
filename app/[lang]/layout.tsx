export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Získání jazyka z params
  const { lang } = await params;
  
  // Volitelně: Ověření, že jazyk je podporovaný
  const supportedLangs = ['ar', 'en', 'ur'];
  if (!supportedLangs.includes(lang)) {
    // Můžeš přesměrovat na výchozí jazyk nebo vyhodit chybu
    // Pro teď jen vrátíme children
  }

  return <>{children}</>;
}