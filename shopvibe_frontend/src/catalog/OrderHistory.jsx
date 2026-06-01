import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ArrowLeft, Package, MapPin, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

const OrderHistory = ({ onBack }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('orders/');
                setOrders(response.data);
            } catch (err) {
                setError('Could not download your previous order list history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const totalSpent = orders.reduce((acc, order) => acc + parseFloat(order.total_amount || 0), 0);
    const totalItemsPurchased = orders.reduce((acc, order) => 
        acc + (order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0), 0
    );

    if (loading) {
        return (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-[#FAF9F5]">
                <div className="w-5 h-5 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-neutral-400 font-medium">Loading your summary statements...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 bg-[#FAF9F5]">
            <motion.button 
                onClick={onBack}
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#121212] transition-colors mb-10 cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4 text-[#C85A32]" />
                <span>Back to products</span>
            </motion.button>

            {/* DASHBOARD SUMMARY ROW METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white p-5 rounded-xl border border-neutral-200/50 shadow-2xs flex items-center gap-4">
                    <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-800"><Package className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Total Orders</p>
                        <p className="text-xl font-bold text-neutral-900 mt-0.5">{orders.length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-200/50 shadow-2xs flex items-center gap-4">
                    <div className="p-2.5 bg-neutral-100 rounded-lg text-neutral-800"><ShoppingBag className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Items Purchased</p>
                        <p className="text-xl font-bold text-neutral-900 mt-0.5">{totalItemsPurchased} items</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-200/50 shadow-2xs flex items-center gap-4">
                    <div className="p-2.5 bg-[#121212] rounded-lg text-white"><DollarSign className="h-4 w-4" /></div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Total Amount Spent</p>
                        <p className="text-xl font-black text-[#C85A32] mt-0.5">${totalSpent.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 space-y-1 border-b border-neutral-200 pb-4">
                <h2 className="text-2xl font-light text-neutral-900 font-serif uppercase tracking-tight">Order Logs</h2>
                <p className="text-xs text-neutral-400 font-medium">Review your complete online purchasing logs and delivery status details.</p>
            </div>

            {error && <p className="text-xs text-rose-600 font-bold my-4">{error}</p>}

            {orders.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-xl p-16 text-center text-neutral-400 space-y-2 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-2xs">
                            
                            {/* Card Header Row Info */}
                            <div className="bg-neutral-50/60 px-6 py-4 border-b border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-xs font-medium">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Order ID</p>
                                    <p className="font-mono font-bold text-neutral-900 mt-0.5">#SV-{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Date Placed</p>
                                    <div className="flex items-center gap-1 text-neutral-600 mt-0.5">
                                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Total Price</p>
                                    <p className="font-bold text-[#C85A32] mt-0.5">${parseFloat(order.total_amount).toFixed(2)}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                        order.status === 'Delivered' || order.status === 'Paid'
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                            : 'bg-neutral-950 border-neutral-950 text-white'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Inner List Splits */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-2 border-b md:border-b-0 md:border-r border-neutral-100 pb-4 md:pb-0 md:pr-6">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Purchased Items</p>
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-[#FAF9F5] border border-neutral-200/50 p-3 rounded-lg text-xs font-medium">
                                            <div>
                                                <p className="font-bold text-neutral-900 font-serif">{item.product_name || 'Premium Item'}</p>
                                                <p className="text-[9px] text-neutral-400 mt-0.5">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-sans font-bold text-neutral-900">${parseFloat(item.price).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Delivery Address</p>
                                    <div className="flex gap-2 bg-[#FAF9F5] border border-neutral-200/50 p-3 rounded-lg text-xs font-medium text-neutral-600">
                                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed whitespace-pre-wrap">{order.shipping_address}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;