import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const ProductDetail = ({ product, onBack, onAddToCart }) => {
    const images = product.images?.length > 0 
        ? product.images 
        : [{ id: 'default', image_url: 't-shirts.avif', alt_text: product.name }];
    
    const resolveLocalPath = (filename) => new URL(`../assets/product_images/${filename}`, import.meta.url).href;
    const [activeImage, setActiveImage] = useState(() => resolveLocalPath(images[0].image_url));

    useEffect(() => {
        if (images.length > 0) setActiveImage(resolveLocalPath(images[0].image_url));
    }, [product]);

    return (
        <div className="w-full min-h-screen bg-[#FAF9F5] text-[#1C1C1C] font-sans selection:bg-[#121212] selection:text-white transition-colors duration-300">
            <div className="w-full max-w-6xl mx-auto px-4 py-12">
                
                
                <motion.button 
                    onClick={onBack}
                    whileHover={{ x: -4 }}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#121212] transition-colors mb-12 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4 text-[#C85A32]" />
                    <span>Back to collection</span>
                </motion.button>

                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    
                    <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
                        <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-neutral-200/60 relative shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={activeImage}
                                    src={activeImage} 
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="w-full h-full object-cover object-center absolute inset-0"
                                />
                            </AnimatePresence>

                            
                            <div className="absolute top-4 left-4 bg-[#121212] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 select-none">
                                <Award className="h-3 w-3 text-[#C85A32]" />
                                <span>Premium Quality</span>
                            </div>
                        </div>
                        
                        
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img) => {
                                    const localThumbUrl = resolveLocalPath(img.image_url);
                                    return (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(localThumbUrl)}
                                            className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                                                activeImage === localThumbUrl ? 'border-[#C85A32] scale-[0.97]' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={localThumbUrl} alt={img.alt_text} className="w-full h-full object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: PRODUCT INFO DETAILS */}
                    <div className="lg:col-span-5 space-y-8">
                        
                        
                        <div className="space-y-3 border-b border-neutral-200/60 pb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32] block px-0.5">{product.category_name}</span>
                            <h1 className="text-3xl sm:text-4xl font-light text-[#1C1C1C] tracking-tight uppercase font-serif leading-tight">{product.name}</h1>
                            <div className="pt-2 flex items-baseline gap-2 px-0.5">
                                <span className="text-3xl font-black text-[#121212]">${parseFloat(product.price).toFixed(2)}</span>
                            </div>
                        </div>

                       
                        <div className="space-y-2 px-0.5">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Product Details</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed font-sans">{product.description}</p>
                        </div>

                        
                        <div className="p-4 bg-white rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs font-bold">
                            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Availability</span>
                            {product.stock > 0 ? (
                                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md text-[11px] font-bold border border-emerald-100/50">In Stock ({product.stock} units)</span>
                            ) : (
                                <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-md text-[11px] border border-rose-100/50">Out of Stock</span>
                            )}
                        </div>

                        
                        <div className="pt-2">
                            <motion.button
                                whileHover={product.stock > 0 ? { y: -1 } : {}}
                                whileTap={product.stock > 0 ? { scale: 0.99 } : {}}
                                onClick={() => onAddToCart(product)}
                                disabled={product.stock <= 0}
                                className="w-full flex items-center justify-center gap-3 bg-[#121212] hover:bg-[#C85A32] disabled:bg-neutral-200 text-white disabled:text-neutral-400 font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md cursor-pointer disabled:cursor-not-allowed transition-colors duration-300"
                            >
                                <span>Add to shopping bag</span>
                                <ShoppingBag className="h-4 w-4" />
                            </motion.button>
                        </div>

                        
                        <div className="space-y-3 pt-6 border-t border-neutral-200/60 text-xs text-neutral-600 font-medium">
                            <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/50">
                                <Truck className="h-4 w-4 text-[#C85A32] shrink-0" />
                                <span>Free priority shipping on all orders</span>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/50">
                                <RotateCcw className="h-4 w-4 text-[#C85A32] shrink-0" />
                                <span>Easy 30-day return policy</span>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200/50">
                                <ShieldCheck className="h-4 w-4 text-[#C85A32] shrink-0" />
                                <span>Securely encrypted checkout protection</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;