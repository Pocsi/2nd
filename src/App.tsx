import { Route, Switch, Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Landing from './pages/Landing';

const queryClient = new QueryClient();

// Use a static base URL for now
const base = '/2nd';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base={base}>
        <div className="min-h-screen bg-background">
          <main>
            <Switch>
              <Route path="/" component={Landing} />
              {/* Add more routes as we build them */}
            </Switch>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;