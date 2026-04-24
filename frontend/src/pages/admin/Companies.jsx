import React, { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllCompanies from '../../hooks/useGetAllCompanies'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Building2, CheckCircle2 } from 'lucide-react'

const Companies = () => {
    // Fetch all companies on mount
    useGetAllCompanies();

    const navigate = useNavigate();
    const { companies = [] } = useSelector(store => store.company || {});
    const { user } = useSelector(store => store.auth);
    const [filterInput, setFilterInput] = useState("");

    // Proper Case Utility
    const toProperCase = (str) => str ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const filteredCompanies = companies.filter((company) => {
        if (!filterInput) return true;
        return company?.name?.toLowerCase().includes(filterInput.toLowerCase());
    });

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
            {/* Noise Overlay */}
            <div className='absolute inset-0 opacity-[0.015] pointer-events-none' style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}></div>
            
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="companies-dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='max-w-6xl mx-auto px-4 py-12 flex-1 w-full relative z-10'
                >
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='p-2 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm'>
                                    <Building2 className='w-5 h-5 text-indigo-600' strokeWidth={1.5} />
                                </div>
                                <h1 className='text-2xl font-medium text-slate-900 tracking-tight'>Registered Companies</h1>
                            </div>
                            <p className='text-slate-500 text-sm font-medium'>Manage and curate your professional corporate presence.</p>
                        </div>
                        <motion.button 
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/admin/companies/create")}
                            className='bg-primary text-white font-bold py-3.5 px-8 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center gap-2 uppercase tracking-widest text-[11px]'
                        >
                            <Plus className='w-4 h-4' strokeWidth={2.5} />
                            Register New Company
                        </motion.button>
                    </div>

                    <div className='space-y-4'>
                        {/* Search Section */}
                        <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 focus-within:border-blue-400 transition-all focus-within:shadow-md group/search'>
                            <div className='p-2 bg-slate-50 rounded-lg group-focus-within/search:bg-blue-50 transition-colors'>
                                <Search className='w-4 h-4 text-slate-400 group-focus-within/search:text-blue-500 transition-colors' strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                placeholder='Search company by name...'
                                className='flex-1 outline-none text-sm font-medium bg-transparent text-slate-700 placeholder:text-slate-300'
                                value={filterInput}
                                onChange={(e) => setFilterInput(e.target.value)}
                            />
                        </div>

                        {/* Labels / Headers */}
                        <div className='px-8 py-2 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                            <div className='w-16'>Brand Logo</div>
                            <div className='flex-1 ml-4'>Company Identity</div>
                            <div className='w-48 hidden md:block'>Registration Details</div>
                            <div className='w-32 text-right'>Operations</div>
                        </div>

                        {/* Company Cards Loop */}
                        <div className='space-y-3'>
                            {filteredCompanies.map((company, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={company?._id} 
                                    onClick={() => navigate(`/admin/companies/${company?._id}`)}
                                    className='bg-white rounded-2xl border border-slate-100 p-5 md:px-8 md:py-7 flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer'
                                >
                                    {/* Logo Section */}
                                    <div className='w-14 h-14 shrink-0 relative'>
                                        <div className='w-full h-full rounded-2xl bg-gradient-to-br from-slate-50 to-white flex items-center justify-center border border-slate-100 shadow-inner overflow-hidden group-hover:border-blue-100 transition-colors'>
                                            {
                                                company?.logo ? (
                                                    <img 
                                                        src={company?.logo} 
                                                        alt="logo" 
                                                        className='w-full h-full object-cover'
                                                    />
                                                ) : (
                                                    <div className='w-full h-full bg-gradient-to-tr from-indigo-50 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg'>
                                                        {company?.name?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className='flex-1 ml-6 min-w-0'>
                                        <h2 className='font-semibold text-lg text-slate-900 truncate leading-tight'>{toProperCase(company?.name)}</h2>
                                        <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1'>Corporate Entity</p>
                                    </div>

                                    {/* Status & Date */}
                                    <div className='w-48 hidden md:flex flex-col gap-1.5'>
                                        <div className='flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full w-fit'>
                                            <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></div>
                                            <span className='text-[9px] font-bold uppercase tracking-tighter'>Active</span>
                                        </div>
                                        <p className='text-[11px] font-medium text-slate-400'>
                                            {company?.createdAt?.split("T")[0]}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className='w-32 text-right'>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/companies/${company?._id}/setup`);
                                            }}
                                            className='inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-all group/btn'
                                        >
                                            <Pencil className='w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform' strokeWidth={1.5} />
                                            EDIT
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {filteredCompanies.length === 0 && (
                        <div className='py-24 text-center bg-white rounded-[2rem] border border-slate-50 shadow-sm mt-4'>
                            <Building2 className='w-12 h-12 text-slate-100 mx-auto mb-4' strokeWidth={1.5} />
                            <p className='text-slate-400 font-bold uppercase tracking-widest text-xs italic'>No matching companies found</p>
                        </div>
                    )}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default Companies
