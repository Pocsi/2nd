import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CryptoIcon } from "@/components/ui/crypto-icon";

const extendedProductSchema = insertProductSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Please select a category"),
});

type ProductFormData = z.infer<typeof extendedProductSchema>;

export default function SellerFlow() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedCryptos, setAcceptedCryptos] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  // Extended cryptocurrency list with L2s and memecoins
  const cryptocurrencies = [
    // Major chains
    { symbol: "BTC", name: "Bitcoin", category: "major" },
    { symbol: "ETH", name: "Ethereum", category: "major" },
    
    // L2 Solutions
    { symbol: "MATIC", name: "Polygon", category: "l2" },
    { symbol: "ARB", name: "Arbitrum", category: "l2" },
    { symbol: "OP", name: "Optimism", category: "l2" },
    { symbol: "BASE", name: "Base", category: "l2" },
    
    // Altcoins
    { symbol: "SOL", name: "Solana", category: "altcoin" },
    { symbol: "ADA", name: "Cardano", category: "altcoin" },
    { symbol: "AVAX", name: "Avalanche", category: "altcoin" },
    
    // Memecoins
    { symbol: "DOGE", name: "Dogecoin", category: "memecoin" },
    { symbol: "SHIB", name: "Shiba Inu", category: "memecoin" },
    { symbol: "PEPE", name: "Pepe", category: "memecoin" },
    { symbol: "BONK", name: "Bonk", category: "memecoin" },
    { symbol: "WIF", name: "Dogwifhat", category: "memecoin" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(extendedProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "",
      condition: "",
      sellerId: 1, // Mocked for MVP
      images: [],
      acceptedCryptocurrencies: [],
      defects: "",
      originalPackaging: false,
    },
  });

  const handleCryptoToggle = (symbol: string) => {
    if (acceptedCryptos.includes(symbol)) {
      setAcceptedCryptos(acceptedCryptos.filter(c => c !== symbol));
    } else {
      setAcceptedCryptos([...acceptedCryptos, symbol]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - selectedImages.length);
    const newSelectedImages = [...selectedImages, ...newFiles];
    
    setSelectedImages(newSelectedImages);
    
    // Create preview URLs for the images
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newSelectedImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setSelectedImages(newSelectedImages);
    setPreviewUrls(newPreviewUrls);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (acceptedCryptos.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one cryptocurrency",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, we would first upload the images to a storage
      // and then save the URLs to the database
      
      // Mock image URLs for MVP
      const imageUrls = previewUrls.length > 0 
        ? previewUrls 
        : ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&h=500"];
      
      const productData = {
        ...data,
        acceptedCryptocurrencies: acceptedCryptos,
        images: imageUrls,
      };
      
      await apiRequest("POST", "/api/products", productData);
      
      toast({
        title: "Success!",
        description: "Your item has been listed for sale",
        variant: "default",
      });
      
      // Clean up preview URLs to avoid memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      reset();
      setAcceptedCryptos([]);
      setSelectedImages([]);
      setPreviewUrls([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-6 bg-neutral-50" id="sell">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Offer an Object</h2>
          <p className="text-sm text-gray-500 mb-6">Once your item is created you will not be able to change any of its information.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div className="order-2 md:order-1">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center mb-6 aspect-square flex flex-col items-center justify-center">
                {selectedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button 
                          type="button" 
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-2">Drag and drop media</p>
                    <p className="text-xs text-gray-400">You can drop .jpg, .png, .gif files</p>
                  </>
                )}
              </div>
              
              <div className="text-center mb-6">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  ref={(ref) => fileInputRef[1](ref)}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none"
                  onClick={() => fileInputRef[0]?.click()}
                >
                  Add Item
                </button>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                  </svg>
                  <span className="text-xs text-gray-400">Upload</span>
                </div>
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400">Camera</span>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  type="button" 
                  className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Right Column - Form Fields */}
            <div className="order-1 md:order-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1" htmlFor="item-price">Price</label>
                    <input 
                      type="number" 
                      id="item-price" 
                      step="0.01"
                      placeholder="0.00"
                      className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-accent`}
                      {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="item-category">Collection *</label>
                  <div className="relative">
                    <select 
                      id="item-category" 
                      className={`w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-accent appearance-none`}
                      {...register("category")}
                    >
                      <option value="">Choose a collection</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Sports & Leisure">Sports & Leisure</option>
                      <option value="Collectibles">Collectibles</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">You can request new collections. Learn more</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="item-title">Name *</label>
                  <input 
                    type="text" 
                    id="item-title" 
                    placeholder="Name your NFT"
                    className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-accent`}
                    {...register("title")}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="item-supply">Supply *</label>
                  <input 
                    type="number" 
                    id="item-supply" 
                    value="1"
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent bg-gray-100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="item-description">Description</label>
                  <textarea 
                    id="item-description" 
                    rows={4} 
                    placeholder="Enter a description"
                    className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-accent`}
                    {...register("description")}
                  ></textarea>
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="item-condition">Item Condition</label>
                  <select 
                    id="item-condition" 
                    className={`w-full p-2 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-accent`}
                    {...register("condition")}
                  >
                    <option value="">Select condition</option>
                    <option value="New">New (Never used, original packaging)</option>
                    <option value="Like New">Like New (Used once or twice, like new condition)</option>
                    <option value="Very Good">Very Good (Lightly used, minimal wear)</option>
                    <option value="Good">Good (Used with some signs of wear)</option>
                    <option value="Acceptable">Acceptable (Well-used but functional)</option>
                  </select>
                  {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition.message}</p>}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Accepted Cryptocurrencies</label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Major Chains</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cryptocurrencies
                        .filter(crypto => crypto.category === "major")
                        .map((crypto) => (
                          <label 
                            key={crypto.symbol} 
                            className={`flex items-center space-x-1 p-2 border rounded-md cursor-pointer transition-colors ${
                              acceptedCryptos.includes(crypto.symbol) 
                                ? 'bg-primary/20 border-primary/50' 
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={acceptedCryptos.includes(crypto.symbol)}
                              onChange={() => handleCryptoToggle(crypto.symbol)}
                              className="sr-only"
                            />
                            <span className="flex items-center">
                              <CryptoIcon currency={crypto.symbol} size={4} className="mr-1" />
                              <span className="text-xs">{crypto.name}</span>
                            </span>
                          </label>
                        ))}
                    </div>
                    
                    <h4 className="font-medium text-sm mb-2">L2 Solutions</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cryptocurrencies
                        .filter(crypto => crypto.category === "l2")
                        .map((crypto) => (
                          <label 
                            key={crypto.symbol} 
                            className={`flex items-center space-x-1 p-2 border rounded-md cursor-pointer transition-colors ${
                              acceptedCryptos.includes(crypto.symbol) 
                                ? 'bg-primary/20 border-primary/50' 
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={acceptedCryptos.includes(crypto.symbol)}
                              onChange={() => handleCryptoToggle(crypto.symbol)}
                              className="sr-only"
                            />
                            <span className="flex items-center">
                              <CryptoIcon currency={crypto.symbol} size={4} className="mr-1" />
                              <span className="text-xs">{crypto.name}</span>
                            </span>
                          </label>
                        ))}
                    </div>
                    
                    <h4 className="font-medium text-sm mb-2">Memecoins</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cryptocurrencies
                        .filter(crypto => crypto.category === "memecoin")
                        .map((crypto) => (
                          <label 
                            key={crypto.symbol} 
                            className={`flex items-center space-x-1 p-2 border rounded-md cursor-pointer transition-colors ${
                              acceptedCryptos.includes(crypto.symbol) 
                                ? 'bg-primary/20 border-primary/50' 
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={acceptedCryptos.includes(crypto.symbol)}
                              onChange={() => handleCryptoToggle(crypto.symbol)}
                              className="sr-only"
                            />
                            <span className="flex items-center">
                              <CryptoIcon currency={crypto.symbol} size={4} className="mr-1" />
                              <span className="text-xs">{crypto.name}</span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Delivery Options</label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100" className="mb-2">
                        <path d="M10,80 C10,85 15,90 20,90 L40,90 C45,90 50,85 50,80 L50,30 C50,25 45,20 40,20 L20,20 C15,20 10,25 10,30 L10,80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <rect x="20" y="40" width="25" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M10,60 L50,60" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="text-sm font-medium">Delivery to Office</span>
                      <p className="text-xs text-gray-500 mt-1">Drop your item at our nearest office location</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100" className="mb-2">
                        <path d="M20,80 C15,80 10,75 10,70 L10,35 C10,30 15,25 20,25 L50,25 L65,40 L90,40 C90,40 90,70 90,70 C90,75 85,80 80,80 L20,80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="30" cy="70" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="70" cy="70" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="text-sm font-medium">Pickup Service</span>
                      <p className="text-xs text-gray-500 mt-1">Request a delivery agent to pick up your item</p>
                    </div>
                  </div>
                
                  <div className="flex items-center mt-4">
                    <input 
                      type="checkbox" 
                      id="terms-checkbox"
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="terms-checkbox" className="ml-2 text-xs text-gray-600">
                      POLICIES & CONDITIONS: NATIONAL & INTERNATIONAL SHIPPING
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
