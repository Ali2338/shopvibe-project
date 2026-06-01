import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

const Register = ({ onSuccess, setShowLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.post('auth/register/', { username, email, password });
            setMessage('Account created! Opening sign in page...');
            setTimeout(() => { if (setShowLogin) setShowLogin(true); }, 1400);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register. Please check details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl min-h-[520px] border border-neutral-200/60">
            {/* Left Cover */}
            <div className="hidden md:flex md:w-1/2 bg-[#121212] p-12 text-white flex-col justify-between relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
                
                <div className="relative z-10 flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-widest">
                    <ShoppingBag className="h-4 w-4 text-[#C85A32]" />
                    <span>Shopvibe</span>
                </div>

                <div className="relative z-10 space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#C85A32] bg-[#C85A32]/10 border border-[#C85A32]/20 px-2.5 py-1 rounded flex items-center gap-1 w-fit">
                        <Sparkles className="h-3 w-3 text-[#C85A32] fill-[#C85A32]" /> Welcome Offer
                    </span>
                    <h3 className="text-3xl font-light font-serif tracking-tight leading-tight uppercase">Create Your <br />New Account</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">Join ShopVibe to build your profile, save your favorite pieces, and check out faster with quick order processing.</p>
                </div>

                <div className="relative z-10 text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C85A32]" />
                    <span>Your personal information is secure</span>
                </div>
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
                <div className="mb-6 space-y-1">
                    <h2 className="text-xl font-bold text-[#121212] tracking-tight uppercase font-serif">Create Account</h2>
                    <p className="text-neutral-400 text-xs">Fill in your information to get started.</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                            placeholder="Choose a username"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                            placeholder="Create a strong password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#121212] hover:bg-[#C85A32] disabled:bg-neutral-200 text-white disabled:text-neutral-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors duration-300 shadow-xs mt-2"
                    >
                        {loading ? 'Creating account...' : 'Register Account'}
                    </button>
                </form>

                {message && <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-xs text-emerald-800 border border-emerald-100 text-center font-medium">{message}</div>}
                {error && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-xs text-rose-800 border border-rose-100 text-center font-medium">{error}</div>}
            </div>
        </div>
    );
};

export default Register;