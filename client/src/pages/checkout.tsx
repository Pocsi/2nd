import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Link, useLocation } from "wouter";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CryptoRate {
  symbol: string;
  name: string;
  usdRate: number;
}

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState("ETH");
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardcoded crypto rates for the MVP
  const cryptoRates: CryptoRate[] = [
    { symbol: "BTC", name: "Bitcoin", usdRate: 36245.78 },
    { symbol: "ETH", name: "Ethereum", usdRate: 2412.35 },
    { symbol: "SOL", name: "Solana", usdRate: 102.76 },
    { symbol: "DOGE", name: "Dogecoin", usdRate: 0.082 },
    { symbol: "ADA", name: "Cardano", usdRate: 0.45 },
    { symbol: "SHIB", name: "Shiba Inu", usdRate: 0.00002 },
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const serviceFee = calculateSubtotal() * 0.05; // 5% service fee
  const shipping = cartItems.length > 0 ? 12.00 : 0;
  const total = calculateSubtotal() + serviceFee + shipping;

  const calculateCryptoAmount = (usdAmount: number, cryptoSymbol: string): number => {
    const rate = cryptoRates.find(rate => rate.symbol === cryptoSymbol);
    return rate ? usdAmount / rate.usdRate : 0;
  };

  const handleProcessPayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create transaction for each item in cart
      const transactions = await Promise.all(cartItems.map(async (item) => {
        const transaction = {
          productId: item.id,
          buyerId: 1, // Mock buyer ID for MVP
          sellerId: item.sellerId,
          amount: item.price + (item.price * 0.05) + (shipping / cartItems.length), // Price + fee + proportional shipping
          cryptoCurrency: selectedCrypto,
          cryptoAmount: calculateCryptoAmount(item.price + (item.price * 0.05) + (shipping / cartItems.length), selectedCrypto),
          fiatLocked: item.price + (item.price * 0.05) + (shipping / cartItems.length),
        };

        const response = await apiRequest("POST", "/api/transactions", transaction);
        return await response.json();
      }));

      toast({
        title: "Payment successful!",
        description: "Your transaction has been initiated. Proceed to verification.",
        variant: "default",
      });

      clearCart();

      // Redirect to verification for the first transaction
      if (transactions && transactions.length > 0) {
        setLocation(`/transaction/${transactions[0].id}/verification`);
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Could not process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white rounded-lg shadow-custom p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mb-6 text-gray-600">Your cart is currently empty.</p>
            <Link href="/">
              <a className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors inline-block">
                Start Shopping
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-custom overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Select Payment Method</h2>
                <p className="text-sm text-gray-500">Choose your preferred cryptocurrency</p>
              </div>
              
              <div className="p-6 space-y-4">
                {cryptoRates.map((crypto) => (
                  <div 
                    key={crypto.symbol}
                    className={`crypto-option bg-white p-4 rounded-md border ${selectedCrypto === crypto.symbol ? 'border-accent' : 'border-gray-200'} flex items-center cursor-pointer hover:border-accent transition-colors`}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                  >
                    <div className="w-10 h-10 mr-4">
                      <CryptoIcon currency={crypto.symbol} />
                    </div>
                    <div>
                      <div className="font-medium">{crypto.name} ({crypto.symbol})</div>
                      <div className="text-sm text-gray-500">1 {crypto.symbol} ≈ ${crypto.usdRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} USD</div>
                    </div>
                    <div className="ml-auto">
                      <input 
                        type="radio" 
                        name="crypto-selection" 
                        checked={selectedCrypto === crypto.symbol} 
                        onChange={() => setSelectedCrypto(crypto.symbol)}
                        className="text-accent focus:ring-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-custom p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.images[0] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&h=500"} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">Condition: {item.condition}</div>
                    </div>
                    <div className="font-semibold">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-custom p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span>Total (USD)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Crypto Equivalent</span>
                  <span>{calculateCryptoAmount(total, selectedCrypto).toFixed(8)} {selectedCrypto}</span>
                </div>
              </div>
              
              <div className="bg-secondary p-4 rounded-md mb-6">
                <div className="flex items-start">
                  <div className="mr-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    The fiat value (${total.toFixed(2)} USD) will be locked at the time of purchase regardless of cryptocurrency price fluctuations.
                  </p>
                </div>
              </div>
              
              <button 
                className={`w-full ${isProcessing ? 'bg-gray-400' : 'bg-primary hover:bg-opacity-90'} text-white py-3 rounded-md transition-colors font-medium flex items-center justify-center`}
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay with Cryptocurrency'
                )}
              </button>
              
              <Link href="/cart">
                <a className="w-full block text-center mt-4 text-primary hover:text-accent transition-colors">
                  Return to Cart
                </a>
              </Link>
              
              <div className="mt-6 text-sm text-gray-500 text-center">
                <p>By proceeding, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
