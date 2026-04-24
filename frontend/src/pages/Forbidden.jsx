import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className='absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl'></div>
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl'></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-red-50 text-center relative z-10"
            >
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">403</h1>
                <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wide">Access Forbidden</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                    It looks like you don't have the necessary clearance to access this portal. 
                    This area is reserved for <span className="font-bold text-slate-900">Verified Recruiters</span> only.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Forbidden;
