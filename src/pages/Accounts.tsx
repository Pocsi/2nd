import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, ArrowRight } from 'lucide-react';

// Mock data - replace with actual API calls
const wallets = [
  {
    id: 1,
    name: 'Bitcoin Wallet',
    balance: '0.5 BTC',
    address: 'bc1q...xyz',
    currency: 'BTC',
  },
  {
    id: 2,
    name: 'Ethereum Wallet',
    balance: '2.5 ETH',
    address: '0x123...abc',
    currency: 'ETH',
  },
];

export default function Accounts() {
  const [showAddWallet, setShowAddWallet] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Your Accounts</h1>
        <p className="text-muted-foreground">
          Manage your cryptocurrency wallets and trading accounts
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {wallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                {wallet.name}
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallet.balance}</div>
              <p className="text-xs text-muted-foreground">
                {wallet.address}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Currency: {wallet.currency}
                </span>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowAddWallet(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Wallet
        </Button>
      </div>

      {showAddWallet && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Name</label>
                <Input placeholder="Enter wallet name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <Input placeholder="Enter wallet address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input placeholder="Enter currency (e.g., BTC, ETH)" />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddWallet(false)}
                >
                  Cancel
                </Button>
                <Button>Add Wallet</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 