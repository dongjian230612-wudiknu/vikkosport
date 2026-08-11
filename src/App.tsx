import { Route, Switch } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { useCart } from './hooks/useCart';

function App() {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-vikko-canvas text-vikko-ink flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/rx-sports">
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="font-display text-3xl font-bold mb-4 text-vikko-black">RX Sports Configurator</h1>
              <p className="text-vikko-muted">Coming soon — Upload your prescription and configure your lenses.</p>
            </div>
          </Route>
          <Route>
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="font-display text-3xl font-bold mb-4 text-vikko-black">404</h1>
              <p className="text-vikko-muted">Page not found.</p>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
