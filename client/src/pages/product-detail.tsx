import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Item added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
          <p className="mb-6">Sorry, we couldn't load the product details.</p>
          <Link href="/">
            <a className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
              Return to Homepage
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <a className="text-primary hover:text-accent transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Browse
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-custom mb-4">
              <img 
                src={product.images[selectedImage] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&h=800"} 
                alt={product.title} 
                className="w-full h-96 object-contain"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-accent' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.title} thumbnail ${index + 1}`} className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="bg-accent text-primary inline-block px-3 py-1 rounded-md text-lg font-semibold mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Condition: {product.condition}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="p-4 bg-secondary rounded-md mb-4">
                <h3 className="font-semibold mb-2">Condition Details:</h3>
                {product.defects && (
                  <div className="mb-2">
                    <span className="font-medium">Defects: </span>
                    <span>{product.defects}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Original Packaging: </span>
                  <span>{product.originalPackaging ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Accepted Cryptocurrencies:</h3>
              <div className="flex flex-wrap gap-2">
                {product.acceptedCryptocurrencies.map((crypto: string, index: number) => (
                  <div key={index} className="bg-gray-100 rounded-full px-3 py-2 flex items-center">
                    <CryptoIcon currency={crypto} className="mr-2" />
                    <span>{crypto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              
              <Link href="/checkout">
                <a className="flex-1 bg-accent text-primary px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors text-center">
                  Buy Now
                </a>
              </Link>
            </div>

            <div className="mt-6 p-4 border border-gray-200 rounded-md">
              <h3 className="font-semibold mb-2">Seller Information:</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Seller #{product.sellerId}</div>
                  <div className="text-sm text-gray-500">Member since {new Date().getFullYear() - 2}</div>
                </div>
                <button className="ml-auto text-primary hover:text-accent transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
