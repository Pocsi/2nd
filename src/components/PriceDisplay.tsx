import { useEffect, useState } from 'react';
import { priceService, SUPPORTED_CRYPTOS, type CryptoId } from '@/lib/price-service';
import { Card, CardContent } from '@/components/ui/card';

interface PriceDisplayProps {
  fiatAmount: number;
  acceptedCryptos?: CryptoId[];
}

interface CryptoPrice {
  id: CryptoId;
  symbol: string;
  amount: string;
}

export function PriceDisplay({ fiatAmount, acceptedCryptos }: PriceDisplayProps) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allPrices = await priceService.convertFiatToAllSupported(fiatAmount);
        
        // Filter prices based on accepted cryptocurrencies if provided
        const filteredPrices = acceptedCryptos
          ? allPrices.filter(price => acceptedCryptos.includes(price.id))
          : allPrices;

        setPrices(filteredPrices);
      } catch (err) {
        setError('Failed to fetch crypto prices');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    updatePrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, [fiatAmount, acceptedCryptos]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-muted rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">
        ${fiatAmount.toFixed(2)} USD
      </div>
      <div className="flex flex-wrap gap-2">
        {prices.map((price) => (
          <Card key={price.id} className="bg-muted/50">
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {price.amount} {price.symbol}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({SUPPORTED_CRYPTOS[price.id].chain})
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 