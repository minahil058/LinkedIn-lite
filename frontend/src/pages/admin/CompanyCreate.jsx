import React, { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Building2, Sparkles, ChevronRight } from 'lucide-react'
import BackButton from '../../components/shared/BackButton'

const CompanyCreate = () => {
    const [companyName, setCompanyName] = useState("");
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            return toast.error("Please provide a valid company name.");
        }
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/admin/companies`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        }
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="company-create-page"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className='max-w-4xl mx-auto px-4 py-16 flex-1 w-full'
                >
                    <div className='mb-10 flex items-center gap-6'>
                        <BackButton />
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <Building2 className='w-5 h-5 text-primary' />
                                <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Register Brand</h1>
                            </div>
                            <p className='text-gray-500 font-bold'>What would you like to name your company? You can refine this later.</p>
                        </div>
                    </div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-premium'
                    >
                        <div className='space-y-10'>
                            <div>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Corporate Identity (Name)</label>
                                <div className='mt-3 relative'>
                                    <input 
                                        type="text" 
                                        className='input-field py-5 text-xl font-black uppercase tracking-tight'
                                        placeholder='e.g. Acme Corporation, TechVision'
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                    <Sparkles className='absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400' />
                                </div>
                            </div>

                            <div className='flex items-center gap-6 pt-6'>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/admin/companies")}
                                    className='px-10 py-4 rounded-2xl border border-gray-200 font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]'
                                >
                                    ABORT
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={registerNewCompany}
                                    className='flex-1 bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all text-sm'
                                >
                                    PROCEED TO SETUP
                                    <ChevronRight className='w-5 h-5' />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default CompanyCreate
