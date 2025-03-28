import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { apiRequest } from "@/lib/queryClient";

interface CryptoOption {
  symbol: string;
  name: string;
  usdRate: number;
  category?: string;
  contractAddress?: string;
}

export default function TransactionProcess() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("ETH");
  const [verificationChecklist, setVerificationChecklist] = useState({
    matchesDescription: false,
    defectsAccurate: false,
    itemFunctional: false
  });
  const [verificationResult, setVerificationResult] = useState<string>("approve");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("major");
  const [showAllCurrencies, setShowAllCurrencies] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { toast } = useToast();

  // Fetch crypto rates from API
  const { data: cryptoRates, isLoading: isLoadingRates } = useQuery<CryptoOption[]>({
    queryKey: ['/api/crypto/rates'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const cryptoOptions: CryptoOption[] = cryptoRates || [
    { symbol: "BTC", name: "Bitcoin", usdRate: 36245.78, category: "major" },
    { symbol: "ETH", name: "Ethereum", usdRate: 2412.35, category: "major" },
    { symbol: "SOL", name: "Solana", usdRate: 102.76, category: "major" },
    { symbol: "MATIC", name: "Polygon", usdRate: 0.54, category: "l2" },
    { symbol: "AVAX", name: "Avalanche", usdRate: 28.95, category: "l2" },
    { symbol: "DOGE", name: "Dogecoin", usdRate: 0.12, category: "memecoin" },
    { symbol: "SHIB", name: "Shiba Inu", usdRate: 0.00002, category: "memecoin" },
    { symbol: "ADA", name: "Cardano", usdRate: 0.45, category: "altcoin" },
    { symbol: "DOT", name: "Polkadot", usdRate: 6.82, category: "altcoin" },
  ];
  
  const [customTokens, setCustomTokens] = useState<CryptoOption[]>([]);
  
  // Combine standard crypto options with any custom tokens
  const allCryptoOptions = [...cryptoOptions, ...customTokens];
  
  const validateCustomToken = async () => {
    if (!contractAddress || contractAddress.length < 10) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid contract address",
        variant: "destructive",
      });
      return;
    }
    
    setIsValidatingToken(true);
    
    try {
      const response = await apiRequest("POST", "/api/crypto/verify-token", {
        contractAddress,
        chain: "ethereum" // Default to Ethereum for now
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        setCustomTokens(prev => {
          // Check if token already exists
          const exists = prev.some(token => 
            token.contractAddress === data.token.contractAddress
          );
          
          if (exists) {
            toast({
              title: "Token Already Added",
              description: `${data.token.name} (${data.token.symbol}) is already in your list.`,
            });
            return prev;
          }
          
          toast({
            title: "Token Added Successfully",
            description: `${data.token.name} (${data.token.symbol}) has been verified and added.`,
          });
          
          return [...prev, {
            ...data.token,
            category: "custom"
          }];
        });
        
        setContractAddress("");
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Could not verify token contract. Please check the address and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An error occurred while verifying the token contract.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingToken(false);
    }
  };

  const orderDetails = {
    itemPrice: 95.00,
    serviceFee: 4.75,
    shipping: 12.00,
    total: 111.75
  };
  
  const [amountInput, setAmountInput] = useState<string>(orderDetails.total.toFixed(2));

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
  };

  const handleChecklistChange = (key: keyof typeof verificationChecklist) => {
    setVerificationChecklist({
      ...verificationChecklist,
      [key]: !verificationChecklist[key]
    });
  };

  const calculateCryptoAmount = (fiatAmount: number, cryptoSymbol: string): number => {
    const crypto = allCryptoOptions.find(c => c.symbol === cryptoSymbol);
    return crypto ? fiatAmount / crypto.usdRate : 0;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Secure Transaction Process</h2>
          <p className="text-gray-600">Our multi-step verification ensures safety for both buyers and sellers when trading with cryptocurrency.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Cryptocurrency Payment Flow */}
          <div className="bg-white rounded-lg shadow-custom p-6 overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">Cryptocurrency Payment Flow</h3>
            
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Select Payment Method</span>
                <span className="text-sm bg-accent text-primary px-2 py-1 rounded">Step 2 of 5</span>
              </div>
              
              <div className="space-y-3">
                {/* Chain Category Tabs */}
                <div className="flex w-full rounded-md overflow-hidden border border-gray-200 mb-2">
                  <button 
                    onClick={() => setExpandedCategory("major")} 
                    className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${expandedCategory === "major" ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Major Chains
                  </button>
                  <button 
                    onClick={() => setExpandedCategory("l2")} 
                    className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${expandedCategory === "l2" ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    L2 Solutions
                  </button>
                  <button 
                    onClick={() => setExpandedCategory("altcoin")} 
                    className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${expandedCategory === "altcoin" ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Altcoins
                  </button>
                  <button 
                    onClick={() => setExpandedCategory("memecoin")} 
                    className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${expandedCategory === "memecoin" ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    Memecoins
                  </button>
                </div>
                
                {/* Cryptocurrency options based on selected category */}
                <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                  {cryptoOptions
                    .filter(crypto => !crypto.category || crypto.category === expandedCategory || (showAllCurrencies && crypto.category))
                    .slice(0, showAllCurrencies ? undefined : 3)
                    .map((crypto) => (
                      <div 
                        key={crypto.symbol}
                        className={`crypto-option p-3 ${selectedCrypto === crypto.symbol ? 'bg-accent bg-opacity-5' : 'bg-white'} border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50 transition-colors`}
                        onClick={() => handleCryptoSelect(crypto.symbol)}
                      >
                        <div className="w-8 h-8 mr-3 flex items-center justify-center">
                          <CryptoIcon currency={crypto.symbol} />
                        </div>
                        <div>
                          <div className="font-medium">{crypto.name} ({crypto.symbol})</div>
                          <div className="text-sm text-gray-500">1 {crypto.symbol} ≈ ${crypto.usdRate.toLocaleString()} USD</div>
                        </div>
                        <div className="ml-auto">
                          <input 
                            type="radio" 
                            name="crypto-selection" 
                            checked={selectedCrypto === crypto.symbol} 
                            onChange={() => handleCryptoSelect(crypto.symbol)}
                            className="text-accent focus:ring-accent"
                          />
                        </div>
                      </div>
                    ))
                  }
                  
                  {!showAllCurrencies && cryptoOptions.filter(crypto => !crypto.category || crypto.category === expandedCategory).length > 3 && (
                    <button 
                      className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAllCurrencies(true)}
                    >
                      <span>Show more currencies</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {showAllCurrencies && (
                    <button 
                      className="w-full py-2 text-sm text-primary font-medium flex items-center justify-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAllCurrencies(false)}
                    >
                      <span>Show less</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Contract Address Input */}
                <div className="rounded-md overflow-hidden shadow-sm border border-gray-200 bg-white mt-4">
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-medium text-sm mb-2">Add Custom Token</div>
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            placeholder="Enter contract address (0x...)" 
                            className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                        <button 
                          onClick={validateCustomToken}
                          disabled={isValidatingToken}
                          className={`px-4 rounded-md text-sm font-medium flex items-center justify-center ${isValidatingToken ? 'bg-gray-100 text-gray-400' : 'bg-accent text-white hover:bg-opacity-90 transition-colors'}`}
                        >
                          {isValidatingToken ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying
                            </>
                          ) : "Verify"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Add any ERC-20, BEP-20 or other token by contract address</p>
                    </div>
                  </div>
                  
                  {/* Custom Tokens List */}
                  {customTokens.length > 0 && (
                    <div className="p-3">
                      <div className="font-medium text-sm mb-2">Your Custom Tokens</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {customTokens.map(token => (
                          <div 
                            key={token.contractAddress}
                            className={`p-2 ${selectedCrypto === token.symbol ? 'bg-accent bg-opacity-5' : 'bg-white'} rounded-md border border-gray-100 flex items-center cursor-pointer hover:bg-gray-50 transition-colors`}
                            onClick={() => handleCryptoSelect(token.symbol)}
                          >
                            <div className="w-6 h-6 mr-2 flex items-center justify-center bg-accent bg-opacity-10 rounded-full flex-shrink-0">
                              <span className="text-xs font-medium">{token.symbol.slice(0, 2)}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm truncate">{token.name}</div>
                              <div className="text-xs text-gray-500 truncate">{token.contractAddress}</div>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <input 
                                type="radio" 
                                name="crypto-selection" 
                                checked={selectedCrypto === token.symbol} 
                                onChange={() => handleCryptoSelect(token.symbol)}
                                className="text-accent focus:ring-accent"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Crypto Calculator */}
                <div className="mt-4 p-3 rounded-md border border-gray-200 bg-white shadow-sm">
                  <div className="font-medium text-sm mb-2">Quick Calculator</div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">USD Amount</label>
                      <input 
                        type="number" 
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">{selectedCrypto} Amount</label>
                      <input 
                        type="text" 
                        value={calculateCryptoAmount(parseFloat(amountInput) || 0, selectedCrypto).toFixed(6)}
                        readOnly 
                        className="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Item Price:</span>
                <span className="font-medium">${orderDetails.itemPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Service Fee:</span>
                <span>${orderDetails.serviceFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Shipping:</span>
                <span>${orderDetails.shipping.toFixed(2)} USD</span>
              </div>
              <div className="h-px bg-gray-200 my-3"></div>
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <div className="text-right">
                  <div className="font-semibold">${orderDetails.total.toFixed(2)} USD</div>
                  <div className="text-sm text-gray-500">
                    ≈ {calculateCryptoAmount(orderDetails.total, selectedCrypto).toFixed(6)} {selectedCrypto}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
              <div className="font-medium text-sm mb-2">Your Wallet Address</div>
              <div className="mb-2">
                <input 
                  type="text" 
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address for receiving assets..." 
                  className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Make sure to enter the correct address for {selectedCrypto}</span>
                <button className="text-primary hover:underline">Scan QR</button>
              </div>
            </div>
            
            <div className="bg-secondary p-4 rounded-md mb-6">
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">The fiat value (${orderDetails.total.toFixed(2)} USD) will be locked at the time of purchase regardless of cryptocurrency price fluctuations.</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex-1 py-3 border border-gray-200 rounded-md text-primary font-medium hover:bg-gray-50 hover:border-primary hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 active:scale-[0.98]">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </div>
              </button>
              <button className="flex-1 py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 active:scale-[0.98] transform">
                <div className="flex items-center justify-center">
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          
          {/* P2P Video Verification */}
          <div className="bg-white rounded-lg shadow-custom p-6 overflow-hidden">
            <h3 className="text-xl font-semibold mb-4">P2P Video Verification</h3>
            
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Verify Item Condition</span>
                <span className="text-sm bg-accent text-primary px-2 py-1 rounded">Step 3 of 5</span>
              </div>
              
              <div className="aspect-video bg-gray-800 rounded-md overflow-hidden mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs">
                  Seller
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="col-span-2">
                  <div className="text-sm font-medium mb-1">Verification Checklist:</div>
                  <div className="space-y-2">
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={verificationChecklist.matchesDescription}
                        onChange={() => handleChecklistChange('matchesDescription')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">The item matches the listing description</span>
                    </label>
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={verificationChecklist.defectsAccurate}
                        onChange={() => handleChecklistChange('defectsAccurate')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">All mentioned defects are visible and accurately described</span>
                    </label>
                    <label className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={verificationChecklist.itemFunctional}
                        onChange={() => handleChecklistChange('itemFunctional')}
                        className="mt-1 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">The seller has demonstrated that the item is functional</span>
                    </label>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-800 rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-primary text-white px-2 py-0.5 rounded text-xs">
                    You
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <button className="flex-1 py-2 bg-white border border-gray-200 rounded-md text-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-sm transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Mute
                </button>
                <button className="flex-1 py-2 bg-white border border-gray-200 rounded-md text-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-sm transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video
                </button>
                <button className="flex-1 py-2 bg-white border border-gray-200 rounded-md text-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-sm transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Leave
                </button>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                Chat with the seller and ask them to demonstrate any features or details you want to verify.
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Post-Verification Options:</div>
              <div className="space-y-3">
                <div 
                  className={`border ${verificationResult === 'approve' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationResult('approve')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationResult === 'approve'}
                      onChange={() => setVerificationResult('approve')}
                      className="text-accent focus:ring-accent" 
                    />
                    <div className="ml-3">
                      <div className="font-medium">Approve & Continue</div>
                      <div className="text-sm text-gray-500">The item is as described and I'm ready to proceed</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border ${verificationResult === 'negotiate' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationResult('negotiate')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationResult === 'negotiate'}
                      onChange={() => setVerificationResult('negotiate')}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Negotiate</div>
                      <div className="text-sm text-gray-500">Request a price adjustment based on the actual condition</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border ${verificationResult === 'cancel' ? 'border-accent' : 'border-gray-200'} rounded-md p-3 hover:border-accent cursor-pointer transition-colors`}
                  onClick={() => setVerificationResult('cancel')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="verification-result" 
                      checked={verificationResult === 'cancel'}
                      onChange={() => setVerificationResult('cancel')}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Cancel Transaction</div>
                      <div className="text-sm text-gray-500">The item is significantly different from what was described</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex-1 py-3 border border-gray-200 rounded-md text-primary font-medium hover:bg-gray-50 hover:border-primary hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 active:scale-[0.98]">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </div>
              </button>
              <button className="flex-1 py-3 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 active:scale-[0.98] transform">
                <div className="flex items-center justify-center">
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}