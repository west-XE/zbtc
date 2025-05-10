import '@solana/wallet-adapter-react-ui/styles.css';

import './globals.css';
import { WalletContextProvider } from '../components/WalletContextProvider';

export const metadata = {
  title: 'zBTC Tipper',
  description: 'Tip with zBTC on Solana',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
