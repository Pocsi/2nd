import { CryptoRate } from "@shared/schema";

/**
 * Available cryptocurrencies with their symbols, names, and icons
 */
export const SUPPORTED_CRYPTOCURRENCIES = [
  // Major chains
  { symbol: "BTC", name: "Bitcoin", category: "major" },
  { symbol: "ETH", name: "Ethereum", category: "major" },
  
  // Layer 2 solutions
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

/**
 * In-memory cache of crypto rates to avoid repeated API calls
 */
let cryptoRatesCache: CryptoRate[] = [];
let lastFetchTime = 0;
const CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches current cryptocurrency rates from the API
 */
export async function fetchCryptoRates(): Promise<CryptoRate[]> {
  const now = Date.now();
  
  // Return cached rates if they're recent enough
  if (cryptoRatesCache.length > 0 && now - lastFetchTime < CACHE_LIFETIME) {
    return cryptoRatesCache;
  }
  
  try {
    const response = await fetch('/api/crypto/rates');
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto rates');
    }
    
    const rates = await response.json();
    cryptoRatesCache = rates;
    lastFetchTime = now;
    
    return rates;
  } catch (error) {
    console.error('Error fetching crypto rates:', error);
    // Return cached rates if available, even if they're stale
    if (cryptoRatesCache.length > 0) {
      return cryptoRatesCache;
    }
    throw error;
  }
}

/**
 * Converts a fiat amount to its cryptocurrency equivalent
 */
export function convertFiatToCrypto(
  fiatAmount: number, 
  cryptoSymbol: string, 
  rates: CryptoRate[]
): number {
  const rate = rates.find(r => r.symbol === cryptoSymbol);
  
  if (!rate) {
    throw new Error(`Exchange rate not found for ${cryptoSymbol}`);
  }
  
  return fiatAmount / rate.usdRate;
}

/**
 * Converts a cryptocurrency amount to its fiat equivalent
 */
export function convertCryptoToFiat(
  cryptoAmount: number, 
  cryptoSymbol: string, 
  rates: CryptoRate[]
): number {
  const rate = rates.find(r => r.symbol === cryptoSymbol);
  
  if (!rate) {
    throw new Error(`Exchange rate not found for ${cryptoSymbol}`);
  }
  
  return cryptoAmount * rate.usdRate;
}

/**
 * Formats a cryptocurrency amount with appropriate precision
 */
export function formatCryptoAmount(amount: number, symbol: string): string {
  // Different cryptos have different typical decimal precisions
  const precisionMap: Record<string, number> = {
    // Major chains
    "BTC": 8,
    "ETH": 6,
    
    // L2 Solutions
    "MATIC": 4,
    "ARB": 6,
    "OP": 6,
    "BASE": 6,
    
    // Altcoins
    "SOL": 4,
    "ADA": 2,
    "AVAX": 4,
    
    // Memecoins
    "DOGE": 2,
    "SHIB": 8,
    "PEPE": 8,
    "BONK": 8,
    "WIF": 8,
  };
  
  const precision = precisionMap[symbol] || 6;
  return amount.toFixed(precision);
}

/**
 * Gets a randomly generated wallet address for demonstration purposes
 */
export function getRandomWalletAddress(symbol: string): string {
  const prefixes: Record<string, string> = {
    // Major chains
    "BTC": "bc1q",
    "ETH": "0x",
    
    // L2 Solutions (most use ETH address format)
    "MATIC": "0x",
    "ARB": "0x",
    "OP": "0x",
    "BASE": "0x",
    
    // Altcoins
    "SOL": "",
    "ADA": "",
    "AVAX": "0x",
    
    // Memecoins
    "DOGE": "D",
    "SHIB": "0x",
    "PEPE": "0x",
    "BONK": "",
    "WIF": "",
  };
  
  const lengths: Record<string, number> = {
    // Major chains
    "BTC": 30,
    "ETH": 40,
    
    // L2 Solutions
    "MATIC": 40,
    "ARB": 40,
    "OP": 40,
    "BASE": 40,
    
    // Altcoins
    "SOL": 30,
    "ADA": 30,
    "AVAX": 40,
    
    // Memecoins
    "DOGE": 34,
    "SHIB": 40,
    "PEPE": 40,
    "BONK": 30,
    "WIF": 30,
  };
  
  const chars = "abcdef0123456789";
  let address = prefixes[symbol] || "";
  
  const length = lengths[symbol] || 30;
  
  for (let i = 0; i < length; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
}
