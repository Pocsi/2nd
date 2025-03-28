import { Route, Switch, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import Landing from './pages/Landing';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

// Use the base URL from Vite's environment
const base = import.meta.env.BASE_URL;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router base={base}>
          <div className="min-h-screen bg-background">
            <main>
              <Switch>
                <Route path="/" component={Landing} />
                {/* Add more routes as we build them */}
              </Switch>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 