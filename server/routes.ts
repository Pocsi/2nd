import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema, insertUserSchema, insertTransactionSchema, insertCartItemSchema, productStepSchema, cryptoPaymentSchema } from "@shared/schema";

// Mock crypto rates for the MVP
const cryptoRates = [
  // Major chains
  { symbol: "BTC", name: "Bitcoin", usdRate: 36245.78 },
  { symbol: "ETH", name: "Ethereum", usdRate: 2412.35 },
  
  // Layer 2 solutions
  { symbol: "MATIC", name: "Polygon", usdRate: 0.58 },
  { symbol: "ARB", name: "Arbitrum", usdRate: 0.73 },
  { symbol: "OP", name: "Optimism", usdRate: 1.92 },
  { symbol: "BASE", name: "Base", usdRate: 0.87 },
  
  // Altcoins
  { symbol: "SOL", name: "Solana", usdRate: 102.76 },
  { symbol: "ADA", name: "Cardano", usdRate: 0.45 },
  { symbol: "AVAX", name: "Avalanche", usdRate: 29.52 },
  
  // Memecoins
  { symbol: "DOGE", name: "Dogecoin", usdRate: 0.082 },
  { symbol: "SHIB", name: "Shiba Inu", usdRate: 0.00002 },
  { symbol: "PEPE", name: "Pepe", usdRate: 0.0000099 },
  { symbol: "BONK", name: "Bonk", usdRate: 0.000026 },
  { symbol: "WIF", name: "Dogwifhat", usdRate: 0.22 },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (userId) {
        const transactions = await storage.getTransactionsByUser(userId);
        return res.json(transactions);
      }
      
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Check if product exists and is available
      const product = await storage.getProduct(transactionData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.status !== "available") {
        return res.status(400).json({ message: "Product is not available" });
      }
      
      // Create transaction
      const newTransaction = await storage.createTransaction(transactionData);
      
      // Update product status to pending
      await storage.updateProductStatus(transactionData.productId, "pending");
      
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id/step", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const stepData = productStepSchema.parse(req.body);
      
      const transaction = await storage.getTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Update transaction step
      const updatedTransaction = await storage.updateTransactionStep(
        transactionId, 
        stepData.step, 
        stepData.status || 'approved'
      );
      
      res.json(updatedTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update transaction step" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const newCartItem = await storage.addCartItem(cartItemData);
      res.status(201).json(newCartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.delete("/api/cart/:userId/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      await storage.removeCartItem(userId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Cryptocurrency rates
  app.get("/api/crypto/rates", (req, res) => {
    try {
      res.json(cryptoRates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto rates" });
    }
  });
  
  // Verify and add custom token by contract address (mock implementation)
  app.post("/api/crypto/verify-token", (req, res) => {
    try {
      const { contractAddress, chain } = req.body;
      
      if (!contractAddress || contractAddress.length < 10) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid contract address format" 
        });
      }
      
      // In a real implementation, this would validate the contract on the blockchain
      // and fetch actual token data. For this MVP, we'll generate mock data.
      const randomTokenName = `Custom Token ${Math.floor(Math.random() * 1000)}`;
      const randomSymbol = randomTokenName.split(' ').map(word => word[0]).join('').toUpperCase();
      const randomRate = (Math.random() * 10).toFixed(6);
      
      setTimeout(() => {
        res.json({
          success: true,
          token: {
            symbol: randomSymbol,
            name: randomTokenName,
            usdRate: parseFloat(randomRate),
            contractAddress,
            chain: chain || "ethereum",
            verified: true
          }
        });
      }, 1000); // Simulate network delay
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to verify token contract" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
