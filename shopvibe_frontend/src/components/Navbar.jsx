import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, LogOut } from 'lucide-react';

const Navbar = ({ isAuthenticated, onLogout, cartCount, onCartToggle, onNavigateHistory, onNavigateProfile, onNavigateHome, currentView }) => {
    return (
        <header className="w-full bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#121212]/10 sticky top-0 z-40 transition-all select-none">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                {/* LOGO */}
                <div onClick={onNavigateHome} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 bg-[#121212] rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight group-hover:bg-[#C85A32] transition-colors duration-300">
                        SV
                    </div>
                    <span className="text-base font-bold tracking-widest text-[#121212] uppercase font-serif">
                        Shop<span className="text-[#C85A32] font-sans font-light lowercase italic">vibe</span>
                    </span>
                </div>

                {/* TEXT NAVIGATION - MAIN OPTIONS */}
                {isAuthenticated && (
                    <nav className="flex items-center gap-6 sm:gap-8 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <button onClick={onNavigateHome} className={`hover:text-[#121212] transition-colors relative pb-1 cursor-pointer ${currentView === 'catalog' || currentView === 'detail' ? 'text-[#121212]' : ''}`}>
                            Shop
                            {(currentView === 'catalog' || currentView === 'detail') && <motion.div layoutId="navLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A32]" />}
                        </button>
                        <button onClick={onNavigateHistory} className={`hover:text-[#121212] transition-colors relative pb-1 cursor-pointer ${currentView === 'history' ? 'text-[#121212]' : ''}`}>
                            Orders
                            {currentView === 'history' && <motion.div layoutId="navLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A32]" />}
                        </button>
                        <button onClick={onNavigateProfile} className={`hover:text-[#121212] transition-colors relative pb-1 cursor-pointer ${currentView === 'profile' ? 'text-[#121212]' : ''}`}>
                            Profile
                            {currentView === 'profile' && <motion.div layoutId="navLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A32]" />}
                        </button>
                    </nav>
                )}

                {/* ACTIONS - CART AND SIGN OUT ONLY */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onCartToggle}
                                className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#C85A32] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer shadow-xs"
                            >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                <span className="text-[#FAF9F5] font-sans font-bold">{cartCount}</span>
                            </motion.button>
                            
                            <div className="h-4 w-px bg-neutral-200 mx-1" />
                            
                            <button onClick={onLogout} title="Sign Out" className="p-2 text-neutral-400 hover:text-rose-600 cursor-pointer transition-colors">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-wider bg-white border border-neutral-200 px-3 py-1.5 rounded-xl select-none">
                            <div className="w-1.5 h-1.5 bg-[#C85A32] rounded-full animate-pulse" />
                            <span>Secure Mode</span>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;