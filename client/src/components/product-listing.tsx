import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Product } from "@shared/schema";

export default function ProductListing() {
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Newest");
  const { addToCart } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <section className="py-12" id="browse">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Browse Products</h2>
            <p className="text-gray-600">Discover unique second-hand items</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={category}
              onChange={handleCategoryChange}
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports & Leisure</option>
              <option>Collectibles</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option>Sort By: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-custom animate-pulse">
                <div className="w-full h-60 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products && products.length > 0 ? (
              products.map((product: Product) => (
                <div key={product.id} className="product-card bg-white rounded-lg overflow-hidden shadow-custom hover:shadow-custom-hover">
                  <Link href={`/product/${product.id}`}>
                    <a>
                      <img 
                        src={product.images[0] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&h=500"} 
                        alt={product.title} 
                        className="w-full h-60 object-cover"
                      />
                    </a>
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <div className="bg-accent text-primary text-sm px-2 py-1 rounded">${product.price.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">Condition: {product.condition}</div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {product.acceptedCryptocurrencies.map((crypto: string, index: number) => (
                          <div key={index} className="crypto-option bg-gray-100 rounded p-1" title={crypto}>
                            <CryptoIcon currency={crypto} />
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="bg-primary text-white rounded-full p-2 hover:bg-opacity-90 transition-colors"
                        onClick={() => handleAddToCart(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-lg text-gray-500">No products found.</p>
                <Link href="/sell">
                  <a className="mt-4 inline-block bg-accent text-primary px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                    Be the first to sell an item
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {products && products.length > 0 && (
          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
