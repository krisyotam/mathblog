'use client';

import Link from 'next/link'
import { DynamicCommandMenu } from '@/components/dynamic-command-menu'
import { useEffect, useState } from 'react'

// Define the structure of a Crypto object
interface Crypto {
  name: string;
  address: string;
}

export default function DonatePage() {
  const [cryptoAddresses, setCryptoAddresses] = useState<Crypto[]>([]); // Use Crypto[] type for state

  useEffect(() => {
    fetch('/api/crypto-addresses')
      .then(response => response.json())
      .then(data => setCryptoAddresses(data));
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">@krisyotam</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/work" className="hover:text-muted-foreground">Work</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/about" className="hover:text-muted-foreground">About</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/now" className="hover:text-muted-foreground">Now</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/contact" className="hover:text-muted-foreground">Contact</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/donate" className="text-muted-foreground">Donate</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Donate</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            If you find my work valuable and would like to support it, you can donate using any of the following cryptocurrencies. Your support is greatly appreciated and helps me continue my research and open-source projects.
          </p>
          <div className="space-y-6">
            {cryptoAddresses.map((crypto) => (
              <div key={crypto.name} className="border border-muted p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">{crypto.name}</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={crypto.address}
                    readOnly
                    className="flex-grow bg-muted p-2 rounded-md text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(crypto.address)}
                    className="p-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    aria-label={`Copy ${crypto.name} address`}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Note: Please ensure you're sending the correct cryptocurrency to its corresponding address. Transactions on most blockchain networks are irreversible.
          </p>
        </div>
      </div>
      <DynamicCommandMenu />
    </main>
  )
}
