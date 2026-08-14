import { Route, Switch } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { RxSports } from './pages/RxSports';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { AdminShell } from './pages/admin/AdminShell';
import { ProductList } from './pages/admin/ProductList';
import { ProductEdit } from './pages/admin/ProductEdit';
import { AdminImages } from './pages/admin/AdminImages';
import { CartProvider, useCart } from './hooks/useCart';
import { CatalogProvider } from './lib/catalog';

function AppShell() {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-vikko-canvas text-vikko-ink flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/rx-sports" component={RxSports} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout/success" component={CheckoutSuccess} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/admin/products/:id">
            <AdminShell>
              <ProductEdit />
            </AdminShell>
          </Route>
          <Route path="/admin/products">
            <AdminShell>
              <ProductList />
            </AdminShell>
          </Route>
          <Route path="/admin/images">
            <AdminShell>
              <AdminImages />
            </AdminShell>
          </Route>
          <Route path="/admin">
            <AdminShell />
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

function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </CatalogProvider>
  );
}

export default App;
