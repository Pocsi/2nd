import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: '/products', label: 'Products' },
    { href: '/accounts', label: 'Accounts' },
    { href: '/selling', label: 'Selling' },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            CryptoMarket
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 