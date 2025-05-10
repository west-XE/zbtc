'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getAssociatedTokenAddress, getAccount, createTransferInstruction } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!publicKey) return;

    (async () => {
      try {
        const mint = new PublicKey(process.env.NEXT_PUBLIC_ZBTC_MINT_ADDRESS!);
        const ata = await getAssociatedTokenAddress(mint, publicKey);
        const account = await getAccount(connection, ata);
        setBalance((+account.amount / 1e8).toString());
      } catch {
        setBalance('0');
      }
    })();
  }, [publicKey, connection]);

  async function handleTip() {
    if (!recipient || !amount) return alert('Please fill in both fields');
    try {
      const mint = new PublicKey(process.env.NEXT_PUBLIC_ZBTC_MINT_ADDRESS!);
      const senderATA = await getAssociatedTokenAddress(mint, publicKey!);
      const recipientPub = new PublicKey(recipient);
      const recipientATA = await getAssociatedTokenAddress(mint, recipientPub);

      const ix = createTransferInstruction(
        senderATA,
        recipientATA,
        publicKey!,
        parseFloat(amount) * 1e8
      );

      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig);
      alert(`Tipped! Tx Signature: ${sig}`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>💁‍♀️<span>zBTC</span>TIPPER</h1>

      <h2> <WalletMultiButton /> </h2>

      {connected && (
        <>
          <p>Your zBTC Balance: {balance}</p>

          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ display: 'block', margin: '1rem 0', width: '100%' }}
          />

          <input
            type="number"
            placeholder="Amount in zBTC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
          />

          <button onClick={handleTip}>Send Tip</button>
        </>
      )}
    </div>
  );
}
