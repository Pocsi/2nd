import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Supported cryptocurrencies with their chain info
export const SUPPORTED_CRYPTOS = {
  bitcoin: {
    symbol: 'BTC',
    name: 'Bitcoin',
    chain: 'Bitcoin',
    decimals: 8
  },
  ethereum: {
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'Ethereum',
    decimals: 18
  },
  'binancecoin': {
    symbol: 'BNB',
    name: 'BNB',
    chain: 'BNB Smart Chain',
    decimals: 18
  },
  polygon: {
    symbol: 'MATIC',
    name: 'Polygon',
    chain: 'Polygon',
    decimals: 18
  }
};

export type CryptoId = keyof typeof SUPPORTED_CRYPTOS;

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

class PriceService {
  private cache: {
    prices: PriceData | null;
    lastUpdate: number;
  } = {
    prices: null,
    lastUpdate: 0
  };

  private readonly CACHE_DURATION = 30000; // 30 seconds

  async getPrices(): Promise<PriceData> {
    if (
      this.cache.prices &&
      Date.now() - this.cache.lastUpdate < this.CACHE_DURATION
    ) {
      return this.cache.prices;
    }

    try {
      const ids = Object.keys(SUPPORTED_CRYPTOS).join(',');
      const response = await axios.get<PriceData>(
        `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`
      );

      this.cache = {
        prices: response.data,
        lastUpdate: Date.now()
      };

      return response.data;
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      throw new Error('Failed to fetch crypto prices');
    }
  }

  async convertFiatToCrypto(
    fiatAmount: number,
    cryptoId: CryptoId
  ): Promise<string> {
    const prices = await this.getPrices();
    const cryptoPrice = prices[cryptoId]?.usd;

    if (!cryptoPrice) {
      throw new Error(`Price not available for ${cryptoId}`);
    }

    const cryptoAmount = fiatAmount / cryptoPrice;
    const decimals = SUPPORTED_CRYPTOS[cryptoId].decimals;
    
    return cryptoAmount.toFixed(Math.min(decimals, 8));
  }

  async convertFiatToAllSupported(fiatAmount: number): Promise<Array<{
    id: CryptoId;
    symbol: string;
    amount: string;
  }>> {
    const prices = await this.getPrices();
    
    return Object.entries(SUPPORTED_CRYPTOS).map(([id, info]) => {
      const cryptoPrice = prices[id]?.usd;
      const cryptoAmount = fiatAmount / cryptoPrice;
      
      return {
        id: id as CryptoId,
        symbol: info.symbol,
        amount: cryptoAmount.toFixed(Math.min(info.decimals, 8))
      };
    });
  }
}

export const priceService = new PriceService(); 