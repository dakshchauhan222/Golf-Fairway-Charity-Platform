import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FAIRWAY — Score. Draw. Give.',
  description: 'Golf scores as lottery numbers. Monthly prizes. Guaranteed charity impact. A subscription platform where every game you play contributes to something bigger.',
  keywords: 'golf, charity, subscription, prize draw, stableford, monthly lottery',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
