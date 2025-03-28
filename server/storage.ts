import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  transactions, type Transaction, type InsertTransaction,
  cartItems, type CartItem, type InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStatus(id: number, status: string): Promise<Product>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  
  // Transaction methods
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStep(id: number, step: number, status: string): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  removeCartItem(userId: number, productId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private transactions: Map<number, Transaction>;
  private cart: Map<number, CartItem>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private transactionIdCounter: number;
  private cartIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.transactions = new Map();
    this.cart = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.transactionIdCounter = 1;
    this.cartIdCounter = 1;
    
    // Add some sample data
    this.setupSampleData();
  }

  private setupSampleData() {
    // Sample users
    this.createUser({
      username: "seller1",
      password: "password123",
      email: "seller1@example.com",
      role: "seller"
    });
    
    this.createUser({
      username: "buyer1",
      password: "password123", 
      email: "buyer1@example.com",
      role: "buyer"
    });
    
    this.createUser({
      username: "agent1",
      password: "password123",
      email: "agent1@example.com",
      role: "agent"
    });
    
    // Sample products
    this.createProduct({
      title: "Vintage Film Camera",
      description: "Fully functional vintage film camera in good condition. The lens is clear and the mechanics work smoothly. Comes with a leather case.",
      price: 120.00,
      condition: "Good",
      sellerId: 1,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&h=500"],
      acceptedCryptocurrencies: ["BTC", "ETH", "DOGE"],
      defects: "Minor scratches on body, small dent on bottom corner",
      originalPackaging: false
    });
    
    this.createProduct({
      title: "Mechanical Keyboard",
      description: "Mechanical keyboard with Cherry MX Blue switches. Great for typing and gaming. Includes all original keycaps.",
      price: 85.00,
      condition: "Excellent",
      sellerId: 1,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&w=500&h=500"],
      acceptedCryptocurrencies: ["BTC", "ETH"],
      defects: "None",
      originalPackaging: true
    });
    
    this.createProduct({
      title: "Wireless Headphones",
      description: "Premium wireless headphones with noise-cancellation. Battery life of about 20 hours. Sound quality is excellent.",
      price: 95.00,
      condition: "Like New",
      sellerId: 1,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&h=500"],
      acceptedCryptocurrencies: ["BTC", "ETH", "SOL"],
      defects: "Small scratch on left ear cup",
      originalPackaging: true
    });
    
    this.createProduct({
      title: "Vintage Watch",
      description: "Classic vintage watch from the 1970s. Recently serviced and keeping accurate time. The band is genuine leather.",
      price: 250.00,
      condition: "Good",
      sellerId: 1,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=500&h=500"],
      acceptedCryptocurrencies: ["BTC", "ETH", "ADA"],
      defects: "Light scratches on crystal, small wear marks on band",
      originalPackaging: false
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const createdAt = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt,
      status: "available"
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStatus(id: number, status: string): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    const updatedProduct = { ...product, status };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.sellerId === sellerId
    );
  }

  // Transaction methods
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const createdAt = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt,
      status: "initiated",
      currentStep: 1,
      updatedAt: createdAt
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStep(id: number, step: number, status: string): Promise<Transaction> {
    const transaction = await this.getTransaction(id);
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    
    const updatedAt = new Date();
    const updatedTransaction: Transaction = {
      ...transaction,
      currentStep: step,
      status,
      updatedAt
    };
    this.transactions.set(id, updatedTransaction);
    
    // If transaction is complete or cancelled, update product status
    if (status === 'approved' && step === 5) {
      await this.updateProductStatus(transaction.productId, 'sold');
    } else if (status === 'cancelled') {
      await this.updateProductStatus(transaction.productId, 'available');
    }
    
    return updatedTransaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.buyerId === userId || transaction.sellerId === userId
    );
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cart.values()).filter(
      item => item.userId === userId
    );
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartIdCounter++;
    const createdAt = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt };
    this.cart.set(id, cartItem);
    return cartItem;
  }

  async removeCartItem(userId: number, productId: number): Promise<void> {
    const cartItems = await this.getCartItems(userId);
    const itemToRemove = cartItems.find(item => item.productId === productId);
    
    if (itemToRemove) {
      this.cart.delete(itemToRemove.id);
    }
  }
}

export const storage = new MemStorage();
