import React, { useState } from 'react';
import api from '../services/api';
import { ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

const Login = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post('auth/login/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            setMessage('Welcome back! Loading your store...');
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl min-h-[520px] border border-neutral-200/60">
            {/* Left Brand Cover */}
            <div className="hidden md:flex md:w-1/2 bg-[#121212] p-12 text-white flex-col justify-between relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
                
                <div className="relative z-10 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-widest">
                    <ShoppingBag className="h-4 w-4 text-[#C85A32]" />
                    <span>Shopvibe</span>
                </div>

                <div className="relative z-10 space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#C85A32] bg-[#C85A32]/10 border border-[#C85A32]/20 px-2.5 py-1 rounded">Sign In</span>
                    <h3 className="text-3xl font-light font-serif tracking-tight leading-tight uppercase">Welcome to <br />Your Storefront</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">Sign in to your account to browse our collection, view your shopping bag, and track your recent orders.</p>
                </div>

                <div className="relative z-10 text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#C85A32]" />
                    <span>Secure Checkout Enabled</span>
                </div>
            </div>

            {/* Right Form Input */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
                <div className="mb-6 space-y-1">
                    <h2 className="text-xl font-bold text-[#121212] tracking-tight uppercase font-serif">Sign In</h2>
                    <p className="text-neutral-400 text-xs">Please enter your account details below.</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1.5 block w-full px-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1.5 block w-full px-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#121212] hover:bg-[#C85A32] disabled:bg-neutral-200 text-white disabled:text-neutral-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors duration-300 shadow-xs mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                </form>

                {message && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-xs text-emerald-800 border border-emerald-100 text-center font-medium">{message}</div>}
                {error && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-xs text-rose-800 border border-rose-100 text-center font-medium">{error}</div>}
            </div>
        </div>
    );
};

export default Login;