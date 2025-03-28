import { Link, useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';

const Navbar = () => {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              CryptoMarket
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/markets" className="text-sm hover:text-primary">
                Markets
              </Link>
              <Link href="/portfolio" className="text-sm hover:text-primary">
                Portfolio
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">
                    ${user.portfolio.balance.toFixed(2)}
                  </span>
                </div>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation('/login')}>
                  Login
                </Button>
                <Button onClick={() => setLocation('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 