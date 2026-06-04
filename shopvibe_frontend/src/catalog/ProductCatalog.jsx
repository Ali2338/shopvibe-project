import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api"; 
import { ShoppingBag, Eye, Search, SlidersHorizontal, ArrowUpRight, X } from "lucide-react";

const ProductCatalog = ({ onAddToCart, onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [maxPrice, setMaxPrice] = useState(2000); 
    const [highestProductPrice, setHighestProductPrice] = useState(2000);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); 

    useEffect(() => {
        const fetchCatalogData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    api.get("products/"),
                    api.get("categories/")
                ]);
                setProducts(productRes.data);
                setCategories(categoryRes.data);

                if (productRes.data.length > 0) {
                    const maxPriceInDB = Math.max(...productRes.data.map(p => parseFloat(p.price)));
                    setHighestProductPrice(Math.ceil(maxPriceInDB));
                    setMaxPrice(Math.ceil(maxPriceInDB));
                }
            } catch (err) {
                setError("Could not load products. Please try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogData();
    }, []);

    const filteredProducts = products
        .filter((product) => {
            const matchesCategory = selectedCategory === "all" || product.category === parseInt(selectedCategory);
            const matchesSearch = 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = parseFloat(product.price) <= maxPrice;
            return matchesCategory && matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === "price-low-high") return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === "price-high-low") return parseFloat(b.price) - parseFloat(a.price);
            return 0; 
        });

    if (loading) {
        return (
            <div className="w-full h-[75vh] flex flex-col items-center justify-center bg-[#FAF9F5]">
                <div className="w-6 h-6 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs text-neutral-400 font-medium">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#FAF9F5] text-[#1C1C1C] font-sans selection:bg-[#121212] selection:text-white transition-colors duration-300">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#121212]/10 pb-12 mb-12 items-end">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-[#C85A32]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">Our Collection</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-light tracking-tighter uppercase font-serif leading-none text-[#1C1C1C]">
                            Bespoke <br /><span className="font-sans font-black italic text-[#121212] lowercase">contours.</span>
                        </h1>
                    </div>

                    <div className="lg:col-span-4 w-full space-y-5">
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
                            Browse through our premium clothing lines, featuring quality denim fabrics, casual essentials, and premium outwear.
                        </p>
                        <div className="flex items-center gap-2 w-full">
                            <div className="relative flex-1">
                                <Search className="absolute top-3.5 left-4 h-3.5 w-3.5 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search items..."
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-[#1C1C1C] focus:outline-none focus:border-[#121212] shadow-2xs transition-all"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsFilterPanelOpen(true)}
                                className="flex items-center justify-center p-3.5 bg-[#121212] text-white rounded-xl cursor-pointer hover:bg-[#C85A32] transition-colors duration-300"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* SLIDABLE CATEGORIES BAR */}
                <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-8 mb-12 border-b border-neutral-200/50 pb-3">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative whitespace-nowrap ${
                            selectedCategory === "all" ? "text-[#121212]" : "text-neutral-400 hover:text-neutral-600"
                        }`}
                    >
                        All Products
                        {selectedCategory === "all" && <motion.div layoutId="studioActiveLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A32]" />}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative whitespace-nowrap ${
                                selectedCategory === cat.id.toString() ? "text-[#121212]" : "text-neutral-400 hover:text-neutral-600"
                              }`}
                        >
                            {cat.name}
                            {selectedCategory === cat.id.toString() && <motion.div layoutId="studioActiveLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A32]" />}
                        </button>
                    ))}
                </div>

                {/* UNIFORM CARD GRID */}
                {error && <p className="text-center text-xs font-semibold text-rose-600 my-4">{error}</p>}

                <AnimatePresence mode="wait">
                    {filteredProducts.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 text-center border border-dashed border-neutral-200 rounded-2xl bg-white/40">
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">No products found matching your search</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            layout
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {filteredProducts.map((product) => {
                                const dbImageName = product.images?.[0]?.image_filename || "placeholder.png";
                                const displayImg = new URL(`../assets/product_images/${dbImageName}`, import.meta.url).href;

                                return (
                                    <motion.div
                                        layout
                                        variants={{
                                            hidden: { opacity: 0, y: 12 },
                                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 22 } }
                                        }}
                                        key={product.id} 
                                        className="group flex flex-col justify-between h-full bg-white border border-neutral-200/50 rounded-2xl p-3.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-300 cursor-pointer"
                                        onClick={() => onProductSelect(product)}
                                    >
                                        <div className="space-y-4">
                                            
                                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF9F5] rounded-xl border border-neutral-100">
                                                <img 
                                                    src={displayImg} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                                                />
                                                
                                                
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" onClick={(e) => e.stopPropagation()}>
                                                    <button 
                                                        onClick={() => onAddToCart(product)}
                                                        disabled={product.stock <= 0}
                                                        className="p-3 bg-[#121212] hover:bg-[#C85A32] text-white rounded-xl shadow-md transition-colors duration-200 cursor-pointer disabled:bg-neutral-200 disabled:cursor-not-allowed"
                                                    >
                                                        <ShoppingBag className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 border border-neutral-200/40">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#121212]">View Product</span>
                                                    <ArrowUpRight className="h-3 w-3 text-[#121212]" />
                                                </div>
                                            </div>

                                            
                                            <div className="px-0.5 space-y-1 h-20 flex flex-col justify-start">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                                                    {product.category_name}
                                                </span>
                                                <h3 className="text-sm font-semibold text-[#1C1C1C] line-clamp-1 tracking-tight font-serif group-hover:text-[#C85A32] transition-colors duration-200">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>

                                        
                                        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between px-0.5">
                                            <span className="text-sm font-bold font-sans text-[#121212]">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                product.stock > 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"
                                            }`}>
                                                {product.stock > 0 ? `In Stock` : "Out of Stock"}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SLIDE-OUT FILTER SIDE DRAWER */}
                <AnimatePresence>
                    {isFilterPanelOpen && (
                        <div className="fixed inset-0 z-50 flex justify-end">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterPanelOpen(false)} className="absolute inset-0 bg-[#121212]/10 backdrop-blur-xs cursor-pointer" />
                            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 260 }} className="relative w-full max-w-sm bg-[#FAF9F5] h-full shadow-2xl p-8 flex flex-col justify-between z-10 border-l border-neutral-200/60">
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center border-b border-neutral-200/60 pb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Filter Preferences</h3>
                                        <button onClick={() => setIsFilterPanelOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-950 cursor-pointer"><X className="h-4 w-4" /></button>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                            <span>Maximum Price</span>
                                            <span className="text-sm font-bold text-[#121212]">${maxPrice}</span>
                                        </div>
                                        <input type="range" min="0" max={highestProductPrice} value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-[#C85A32] h-0.5 bg-neutral-200 appearance-none cursor-pointer" />
                                    </div>
                                    <div className="space-y-3">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sort By</span>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none appearance-none cursor-pointer">
                                            <option value="default">Default Sorting</option>
                                            <option value="price-low-high">Price: Low to High</option>
                                            <option value="price-high-low">Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSortBy("default"); setMaxPrice(highestProductPrice); setIsFilterPanelOpen(false); }} className="w-full py-4 text-center bg-[#121212] hover:bg-[#C85A32] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm">Clear Filters</button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductCatalog;