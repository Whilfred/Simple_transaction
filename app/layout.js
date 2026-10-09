import 'flag-icons/css/flag-icons.min.css';
import './globals.css';
import Shell from '@/components/Shell';
import { SITE } from '@/lib/config';

export const metadata = {
  title: `${SITE.nom} — Achetez et vendez vos cryptos`,
  description: "Achat et vente d'USDT simplement, en FCFA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
