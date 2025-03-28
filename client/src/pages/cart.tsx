import { useCart } from "@/contexts/cart-context";
import { Link } from "wouter";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { useState } from "react";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantities({ ...quantities, [productId]: newQuantity });
      updateQuantity(productId, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (quantities[item.id] || 1), 0);
  };

  const serviceFee = calculateSubtotal() * 0.05; // 5% service fee
  const shipping = cartItems.length > 0 ? 12.00 : 0;
  const total = calculateSubtotal() + serviceFee + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
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
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-custom overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</h2>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row">
                    <div className="w-full md:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <img 
                        src={item.images[0] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&h=500"} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <Link href={`/product/${item.id}`}>
                          <a className="font-semibold hover:text-accent transition-colors">
                            {item.title}
                          </a>
                        </Link>
                        <div className="text-right">
                          <div className="font-semibold">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">Condition: {item.condition}</div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.acceptedCryptocurrencies.map((crypto: string, idx: number) => (
                          <div key={idx} className="bg-gray-100 rounded-full p-1" title={crypto}>
                            <CryptoIcon currency={crypto} size={4} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                            onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                            disabled={(quantities[item.id] || 1) <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <div className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                            {quantities[item.id] || 1}
                          </div>
                          <button 
                            className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                            onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
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
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <a className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center">
                  Proceed to Checkout
                </a>
              </Link>
              
              <div className="mt-6 text-sm text-gray-500 text-center">
                <p>Fiat value will be locked at the time of purchase.</p>
                <p>Prices shown in USD.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
