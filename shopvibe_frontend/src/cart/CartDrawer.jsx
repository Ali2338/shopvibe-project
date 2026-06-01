import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api'; 
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, CheckCircle } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onClearCart }) => {
    const [shippingAddress, setShippingAddress] = useState('');
    const [showAddressInput, setShowAddressInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const resolveLocalPath = (filename) => new URL(`../assets/product_images/${filename || "t-shirts.avif"}`, import.meta.url).href;

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!shippingAddress.trim()) {
            setError('Please enter a valid shipping address.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await api.post('orders/', {
                shipping_address: shippingAddress,
                cart_items: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
            });

            const checkoutUrl = response.data?.checkout_url;
            if (checkoutUrl) {
                if (onClearCart) onClearCart();
                setShippingAddress('');
                setShowAddressInput(false);
                onClose();
                window.location.href = checkoutUrl;
            } else {
                setOrderSuccess(true);
                if (onClearCart) onClearCart();
                setTimeout(() => {
                    setOrderSuccess(false);
                    onClose();
                }, 2500);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Checkout failed. Please check item stock.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end font-sans selection:bg-[#121212] selection:text-white">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#121212]/10 backdrop-blur-xs cursor-pointer" />

                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 240 }} className="relative w-full max-w-md bg-[#FAF9F5] h-full shadow-2xl flex flex-col z-10 border-l border-[#121212]/10">
                        
                        
                        <div className="p-6 border-b border-[#121212]/10 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag className="h-4 w-4 text-[#C85A32]" />
                                <h2 className="text-sm font-bold text-[#121212] uppercase tracking-wider">Your Bag</h2>
                                <span className="text-[10px] bg-[#FAF9F5] border border-neutral-200 px-2 py-0.5 rounded-md font-bold text-neutral-500">
                                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} ITEMS
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors"><X className="h-4 w-4" /></button>
                        </div>

                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {orderSuccess ? (
                                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                                    <CheckCircle className="h-10 w-10 text-[#C85A32] mb-4 animate-pulse" />
                                    <h3 className="text-base font-bold text-[#111] uppercase tracking-wider">Order Successful</h3>
                                    <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">Your order has been verified and processed successfully.</p>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <div className="h-full flex flex-col justify-center items-center text-center text-neutral-400 space-y-2">
                                    <ShoppingBag className="h-6 w-6 stroke-1.5 text-neutral-300" />
                                    <p className="text-xs font-bold uppercase tracking-wider">Your shopping bag is empty</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cartItems.map((item) => (
                                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="flex items-center gap-4 bg-white border border-neutral-200/60 p-3 rounded-xl shadow-2xs">
                                            <img src={resolveLocalPath(item.images?.[0]?.image_url || item.image_url)} alt={item.name} className="w-16 h-20 object-cover bg-[#FAF9F5] rounded-lg border border-neutral-100 aspect-[3/4]" />
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <h4 className="text-xs font-bold text-[#1C1C1C] truncate tracking-tight uppercase font-serif">{item.name}</h4>
                                                <p className="text-xs font-bold text-[#C85A32]">${parseFloat(item.price).toFixed(2)}</p>
                                                
                                                <div className="flex items-center gap-2 mt-2 w-fit bg-[#FAF9F5] border border-neutral-200 rounded-md px-1 py-0.5">
                                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer"><Minus className="h-2.5 w-2.5" /></button>
                                                    <span className="text-[11px] font-bold px-1 min-w-[14px] text-center text-neutral-800">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 text-neutral-400 hover:text-neutral-900 cursor-pointer"><Plus className="h-2.5 w-2.5" /></button>
                                                </div>
                                            </div>
                                            <button onClick={() => onRemove(item.id)} className="p-2 text-neutral-300 hover:text-neutral-900 transition-colors cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* CHECKOUT SECTION */}
                        {cartItems.length > 0 && !orderSuccess && (
                            <div className="p-6 border-t border-[#121212]/10 bg-white space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-neutral-400">Total Subtotal</span>
                                    <span className="text-base font-bold text-[#121212]">${subtotal.toFixed(2)}</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    {!showAddressInput ? (
                                        <button onClick={() => setShowAddressInput(true)} className="w-full bg-[#121212] hover:bg-[#C85A32] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer shadow-sm">
                                            Proceed to Checkout
                                        </button>
                                    ) : (
                                        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleCheckoutSubmit} className="space-y-3 block w-full">
                                            <div className="relative">
                                                <MapPin className="absolute top-4 left-4 h-3.5 w-3.5 text-neutral-400" />
                                                <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Enter your delivery address..." required rows="2" className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] resize-none leading-relaxed" />
                                            </div>
                                            {error && <p className="text-[10px] text-rose-600 font-bold text-center">{error}</p>}
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setShowAddressInput(false)} className="w-1/3 border border-neutral-200 bg-white text-neutral-500 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl cursor-pointer">Cancel</button>
                                                <button type="submit" disabled={loading} className="w-2/3 bg-[#121212] hover:bg-[#C85A32] text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl cursor-pointer transition-all shadow-sm">{loading ? 'Processing...' : 'Place Order'}</button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;