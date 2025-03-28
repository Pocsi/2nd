import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Plus } from 'lucide-react';
import { PriceDisplay } from '@/components/PriceDisplay';
import { SUPPORTED_CRYPTOS, type CryptoId } from '@/lib/price-service';

// Mock data - replace with actual API calls
const myProducts = [
  {
    id: 1,
    name: 'Digital Art NFT',
    description: 'Unique digital artwork available for crypto trading',
    price: 500, // USD
    image: 'https://via.placeholder.com/300x200',
    status: 'active',
    acceptedCryptos: ['bitcoin', 'ethereum'] as CryptoId[],
  },
  {
    id: 2,
    name: 'Premium Course',
    description: 'Complete web development course',
    price: 2000, // USD
    image: 'https://via.placeholder.com/300x200',
    status: 'pending',
    acceptedCryptos: ['ethereum', 'polygon'] as CryptoId[],
  },
];

export default function Selling() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    acceptedCryptos: [] as CryptoId[],
  });

  const toggleCrypto = (cryptoId: CryptoId) => {
    setNewProduct(prev => ({
      ...prev,
      acceptedCryptos: prev.acceptedCryptos.includes(cryptoId)
        ? prev.acceptedCryptos.filter(id => id !== cryptoId)
        : [...prev.acceptedCryptos, cryptoId]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <p className="text-muted-foreground">
          List and manage your products for crypto trading
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {myProducts.map((product) => (
          <Card key={product.id}>
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
                <span
                  className={`text-sm ${
                    product.status === 'active'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowAddProduct(true)}
        >
          <Plus className="h-4 w-4" />
          List New Product
        </Button>
      </div>

      {showAddProduct && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>List New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (USD)</label>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({
                    ...prev,
                    price: e.target.value
                  }))}
                />
              </div>
              {newProduct.price && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Preview</label>
                  <PriceDisplay
                    fiatAmount={Number(newProduct.price)}
                    acceptedCryptos={newProduct.acceptedCryptos}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Accept Payments In</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SUPPORTED_CRYPTOS).map(([id, info]) => (
                    <Button
                      key={id}
                      type="button"
                      variant={newProduct.acceptedCryptos.includes(id as CryptoId) ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => toggleCrypto(id as CryptoId)}
                    >
                      <span>{info.symbol}</span>
                      <span className="text-xs text-muted-foreground">
                        ({info.chain})
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    or drag and drop
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancel
                </Button>
                <Button>List Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 