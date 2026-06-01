import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './auth/Login';
import Register from './auth/Register';
import ProductCatalog from './catalog/ProductCatalog';
import ProductDetail from './catalog/ProductDetail';  
import OrderHistory from './catalog/OrderHistory'; 
import UserProfile from './catalog/UserProfile';
import Navbar from './components/Navbar';
import CartDrawer from './cart/CartDrawer'; 

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  
  const [currentView, setCurrentView] = useState('catalog'); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('sv_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sv_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = () => {
    localStorage.clear();
    setCartItems([]);
    setSelectedProduct(null); 
    setCurrentView('catalog'); 
    setIsAuthenticated(false);
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) 
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1C1C1C] font-sans antialiased selection:bg-[#121212] selection:text-white pb-20">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        cartCount={totalItemsCount} 
        onCartToggle={() => setIsCartOpen(true)} 
        onNavigateHistory={() => setCurrentView('history')} 
        onNavigateProfile={() => setCurrentView('profile')}
        onNavigateHome={() => {
          setSelectedProduct(null);
          setCurrentView('catalog');
        }}
        currentView={currentView}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {isAuthenticated ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full"
            >
              {currentView === 'profile' ? (
                <UserProfile onBack={() => setCurrentView('catalog')} onLogout={handleLogout} />
              ) : currentView === 'history' ? (
                <OrderHistory onBack={() => setCurrentView('catalog')} />
              ) : currentView === 'detail' && selectedProduct ? (
                <ProductDetail 
                  product={selectedProduct} 
                  onBack={() => setCurrentView('catalog')} 
                  onAddToCart={addToCart} 
                />
              ) : (
                <ProductCatalog 
                  onAddToCart={addToCart} 
                  onProductSelect={(product) => {
                    setSelectedProduct(product);
                    setCurrentView('detail');
                  }} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="min-h-[75vh] flex flex-col justify-center items-center py-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={showLogin ? "login" : "register"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center"
              >
                {showLogin ? (
                  <Login onSuccess={() => setIsAuthenticated(true)} />
                ) : (
                  <Register onSuccess={() => setIsAuthenticated(true)} setShowLogin={setShowLogin} />
                )}
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-xl border border-neutral-300 bg-white text-[#121212] hover:border-[#121212] transition-colors duration-200 cursor-pointer"
              >
                {showLogin ? "Create a new account" : "Back to sign in"}
              </button>
            </div>
          </div>
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeFromCart} 
        onClearCart={() => setCartItems([])} 
      />
    </div>
  );
}

export default App;