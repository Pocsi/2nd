import { Route, Switch, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Landing from './pages/Landing';
import Products from './pages/Products';
import Accounts from './pages/Accounts';
import Selling from './pages/Selling';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

// Use the same base URL as Vite config
const base = '/2nd/';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base={base}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/products" component={Products} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/selling" component={Selling} />
            </Switch>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;