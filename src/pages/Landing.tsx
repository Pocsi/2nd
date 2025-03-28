import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { ArrowRight, TrendingUp, Shield, Wallet } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Trade Crypto with Confidence
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your trusted platform for cryptocurrency trading. Real-time market data,
          secure transactions, and professional trading tools.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/markets">View Markets</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose CryptoMarket?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg">
              <TrendingUp className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Real-time Trading</h3>
              <p className="text-muted-foreground">
                Get instant access to live market data and execute trades in real-time.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Industry-leading security measures to protect your assets.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <Wallet className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
              <p className="text-muted-foreground">
                Track and manage your crypto portfolio with advanced tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Start Trading?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of traders who trust CryptoMarket for their cryptocurrency
          trading needs.
        </p>
        <Button asChild size="lg">
          <Link href="/register">Create Account</Link>
        </Button>
      </section>
    </div>
  );
} 