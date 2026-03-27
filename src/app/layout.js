import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'GolfCharity - Play Golf, Win Prizes, Support Charities',
  description: 'A subscription platform that combines golf performance tracking, monthly prize draws, and meaningful charity contributions. Subscribe, play, and make a difference.',
  keywords: 'golf, charity, subscription, prize draw, stableford, scores',
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
