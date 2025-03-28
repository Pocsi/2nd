import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { PriceDisplay } from '@/components/PriceDisplay';
import { CryptoId } from '@/lib/price-service';

// Mock data - replace with actual API calls
const products = [
  {
    id: 1,
    name: 'Digital Art NFT',
    description: 'Unique digital artwork available for crypto trading',
    price: 500, // USD
    image: 'https://via.placeholder.com/300x200',
    seller: 'Artist123',
    acceptedCryptos: ['bitcoin', 'ethereum'] as CryptoId[],
  },
  {
    id: 2,
    name: 'Premium Course',
    description: 'Complete web development course',
    price: 2000, // USD
    image: 'https://via.placeholder.com/300x200',
    seller: 'EduTech',
    acceptedCryptos: ['ethereum', 'polygon'] as CryptoId[],
  },
  // Add more products as needed
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Available Products</h1>
        <p className="text-muted-foreground">
          Browse and trade products using cryptocurrencies
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <PriceDisplay
                fiatAmount={product.price}
                acceptedCryptos={product.acceptedCryptos}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  by {product.seller}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Trade Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 