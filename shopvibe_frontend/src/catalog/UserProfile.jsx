import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, CheckCircle, LogOut } from 'lucide-react';

const UserProfile = ({ onBack, onLogout }) => {
    const [profile, setProfile] = useState({ username: '', email: '', phone_number: '', shipping_address: '' });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('profile/');
                setProfile(response.data);
                setUsername(response.data.username || '');
                setEmail(response.data.email || '');
                setPhoneNumber(response.data.phone_number || '');
                setShippingAddress(response.data.shipping_address || '');
            } catch (err) {
                setError('Failed to load your profile details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setSaving(true);

        try {
            const response = await api.patch('profile/', {
                username: username,
                email: email,
                phone_number: phoneNumber,
                shipping_address: shippingAddress
            });
            setProfile(response.data);
            setSuccessMsg('Your profile has been updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError('Could not update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-[#FAF9F5]">
                <div className="w-5 h-5 border-2 border-[#C85A32] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-neutral-400 font-medium">Loading your profile...</p>
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

            
            <div className="mb-10 space-y-1.5 border-b border-neutral-200/60 pb-5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C85A32]">Settings</span>
                <h2 className="text-2xl font-light text-[#1C1C1C] font-serif uppercase tracking-tight">Profile Information</h2>
                <p className="text-xs text-neutral-400">View and manage your account details, contact info, and delivery address.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: ACCOUNT INFOCARD */}
                <div className="lg:col-span-4 bg-white border border-neutral-200/50 rounded-xl p-6 text-center shadow-2xs h-fit flex flex-col items-center">
                    <div className="h-16 w-16 bg-[#121212] text-white rounded-full flex items-center justify-center font-serif text-2xl font-light mb-3 shadow-2xs">
                        {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3 className="text-base font-bold text-[#1C1C1C] uppercase font-serif tracking-tight">{profile.username}</h3>
                    
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[9px] bg-neutral-50 text-neutral-600 border border-neutral-200/60 font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                        <Shield className="h-3 w-3 text-[#C85A32]" />
                        <span>Verified Member</span>
                    </div>

                    <div className="w-full border-t border-neutral-100 mt-5 pt-4 text-left space-y-2">
                        <div className="flex items-center gap-2.5 text-neutral-500 text-xs bg-[#FAF9F5] p-3 rounded-lg border border-neutral-200/40 font-medium truncate">
                            <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{profile.email}</span>
                        </div>
                        {profile.phone_number && (
                            <div className="flex items-center gap-2.5 text-neutral-500 text-xs bg-[#FAF9F5] p-3 rounded-lg border border-neutral-200/40 font-medium">
                                <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                                <span>{profile.phone_number}</span>
                            </div>
                        )}
                        <button onClick={onLogout} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors duration-150">
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: INTERACTIVE FORM FOR ALL DETAILS */}
                <div className="lg:col-span-8 bg-white border border-neutral-200/50 rounded-xl p-6 shadow-2xs">
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Username</label>
                                <div className="relative mt-2">
                                    <User className="absolute top-3.5 left-4 h-3.5 w-3.5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                                <div className="relative mt-2">
                                    <Mail className="absolute top-3.5 left-4 h-3.5 w-3.5 text-neutral-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</label>
                            <div className="relative mt-2">
                                <Phone className="absolute top-3.5 left-4 h-3.5 w-3.5 text-neutral-400" />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipping Address</label>
                            <div className="relative mt-2">
                                <MapPin className="absolute top-4 left-4 h-3.5 w-3.5 text-neutral-400" />
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your full shipping address for deliveries..."
                                    rows="3"
                                    className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#121212] transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {successMsg && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-neutral-950 text-white rounded-xl text-xs font-semibold">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>{successMsg}</span>
                            </motion.div>
                        )}
                        {error && <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-100">{error}</div>}

                        <div className="pt-2">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto min-w-[140px] bg-[#121212] hover:bg-[#C85A32] disabled:bg-neutral-200 text-white disabled:text-neutral-400 font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl transition-colors duration-300 shadow-2xs cursor-pointer"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;