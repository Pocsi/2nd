import SellerFlow from "@/components/seller-flow";
import { Separator } from "@/components/ui/separator";

export default function Sell() {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Sell Your Items</h1>
          <p className="text-gray-600 mt-2">Create a listing and start selling your pre-loved items for cryptocurrency</p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tips for Successful Selling</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-custom">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Quality Photos</h3>
              <p className="text-sm text-gray-600">Take clear, well-lit photos from multiple angles. Ensure all defects are visible.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-custom">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Detailed Description</h3>
              <p className="text-sm text-gray-600">Be honest about the condition. Include dimensions, materials, and any defects or wear.</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-custom">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fair Pricing</h3>
              <p className="text-sm text-gray-600">Research similar items to set a competitive price. Be open to accepting various cryptocurrencies.</p>
            </div>
          </div>
        </div>
        
        <SellerFlow />
      </div>
    </div>
  );
}
