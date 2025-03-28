import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Shop Second-Hand with Crypto</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Discover, buy and sell pre-loved items using cryptocurrencies with our secure P2P verification system.
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
            <Link href="/#browse">
              <a className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                Browse Products
              </a>
            </Link>
            <Link href="/sell">
              <a className="bg-accent text-primary px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                Sell Your Items
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
