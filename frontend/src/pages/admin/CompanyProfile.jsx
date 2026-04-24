import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import useGetCompanyById from '../../hooks/useGetCompanyById'
import useGetAllJobs from '../../hooks/useGetAllJobs'
import { Building2, Globe, MapPin, Pencil, Briefcase, Calendar, ChevronRight, Loader2, Info } from 'lucide-react'
import BackButton from '../../components/shared/BackButton'

const CompanyProfile = () => {
    const params = useParams();
    const navigate = useNavigate();
    const companyId = params.id;

    // Sync Data
    useGetCompanyById(companyId);
    useGetAllJobs();

    const { singleCompany } = useSelector(store => store.company || {});
    const { allJobs = [] } = useSelector(store => store.job || {});
    const { user } = useSelector(store => store.auth);

    // Filter jobs for this specific company - Robust check for ID or Object
    const companyJobs = allJobs?.filter(job => job.company?._id === companyId || job.company === companyId) || [];

    // Proper Case Utility
    const toProperCase = (str) => str ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";

    // Auth Check
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    if (!singleCompany) return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50'>
            <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' strokeWidth={1.5} />
            <p className='font-bold text-slate-400 text-sm tracking-widest uppercase'>Syncing Company Profile...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
            {/* Noise Overlay Background */}
            <div className='absolute inset-0 opacity-[0.015] pointer-events-none' style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}></div>
            
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="company-profile-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className='max-w-6xl mx-auto px-4 py-12 flex-1 w-full relative z-10'
                >
                    {/* Top Action Bar */}
                    <div className='mb-8 flex items-center justify-between'>
                        <BackButton />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/admin/companies/${companyId}/setup`)}
                            className='inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[11px] shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest'
                        >
                            <Pencil className='w-3.5 h-3.5' strokeWidth={1.5} />
                            Edit Profile
                        </motion.button>
                    </div>

                    {/* Elite Profile Header */}
                    <motion.div 
                        className='bg-white rounded-[2.5rem] border border-slate-50 p-8 md:p-12 shadow-md mb-10'
                    >
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-10 text-center md:text-left'>
                            <div className='w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center border border-slate-100 shadow-inner overflow-hidden'>
                                {singleCompany?.logo ? (
                                    <img src={singleCompany.logo} alt="brand logo" className='w-full h-full object-cover' />
                                ) : (
                                    <Building2 className='w-16 h-16 text-slate-200' strokeWidth={1.5} />
                                )}
                            </div>
                            <div className='flex-1'>
                                <h1 className='text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4'>
                                    {toProperCase(singleCompany?.name)}
                                </h1>
                                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8'>
                                    {singleCompany?.website && (
                                        <a href={singleCompany.website} target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[11px] font-bold uppercase tracking-tight hover:bg-blue-100 transition-colors'>
                                            <Globe className='w-3.5 h-3.5' strokeWidth={1.5} />
                                            Official Website
                                        </a>
                                    )}
                                    <div className='flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100 text-[11px] font-bold uppercase tracking-tight'>
                                        <MapPin className='w-3.5 h-3.5' strokeWidth={1.5} />
                                        {singleCompany?.location || "Global Headquarters"}
                                    </div>
                                </div>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10'>
                                    <div className='p-6 rounded-2xl bg-slate-50/50 border border-slate-100'>
                                        <div className='flex items-center gap-2 mb-3 text-indigo-600'>
                                            <Info className='w-4 h-4' strokeWidth={2} />
                                            <h3 className='text-[11px] font-black uppercase tracking-widest'>About the Brand</h3>
                                        </div>
                                        <p className='text-slate-600 text-sm leading-relaxed font-medium'>
                                            {singleCompany?.description || "A forward-thinking company building the future of their industry."}
                                        </p>
                                    </div>
                                    <div className='p-6 rounded-2xl bg-slate-50/50 border border-slate-100'>
                                        <div className='flex items-center gap-2 mb-3 text-emerald-600'>
                                            <Briefcase className='w-4 h-4' strokeWidth={2} />
                                            <h3 className='text-[11px] font-black uppercase tracking-widest'>Talent Pipeline</h3>
                                        </div>
                                        <div className='flex items-center gap-6'>
                                            <div>
                                                <p className='text-2xl font-bold text-slate-900'>{companyJobs?.length || 0}</p>
                                                <p className='text-[10px] font-bold text-slate-400 uppercase'>Active Jobs</p>
                                            </div>
                                            <div className='w-px h-8 bg-slate-200'></div>
                                            <div>
                                                <p className='text-2xl font-bold text-slate-900'>
                                                    {companyJobs?.reduce((acc, job) => acc + (job?.applications?.length || 0), 0)}
                                                </p>
                                                <p className='text-[10px] font-bold text-slate-400 uppercase'>Total Applicants</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Jobs Section */}
                    <div>
                        <div className='flex items-center justify-between mb-8 px-4'>
                            <div>
                                <h2 className='text-2xl font-bold text-slate-900 tracking-tight'>Career Opportunities</h2>
                                <p className='text-slate-500 text-sm font-medium mt-1'>Explore active roles at {toProperCase(singleCompany?.name)}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {companyJobs?.length > 0 ? companyJobs.map((job, idx) => (
                                <motion.div 
                                    key={job?._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => navigate(`/description/${job?._id}`)}
                                    className='p-6 rounded-2xl bg-white border border-slate-50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full'
                                >
                                    {/* Header: Urgency Status */}
                                    <div className='flex items-center justify-between mb-5'>
                                        <div className='flex items-center gap-2'>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                new Date(job?.createdAt).toDateString() === new Date().toDateString() 
                                                ? 'bg-amber-50 text-amber-600' 
                                                : 'bg-slate-50 text-slate-400'
                                            }`}>
                                                {new Date(job?.createdAt).toDateString() === new Date().toDateString() ? "🔥 Published Today" : "Active Role"}
                                            </span>
                                        </div>
                                        <div className='text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <ChevronRight className='w-4 h-4' strokeWidth={2} />
                                        </div>
                                    </div>

                                    {/* Brand & Title */}
                                    <div className='flex items-start gap-4 mb-5'>
                                        <div className='w-12 h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shadow-sm group-hover:border-primary/20 transition-colors overflow-hidden'>
                                            {singleCompany?.logo ? (
                                                <img src={singleCompany.logo} alt="logo" className='w-full h-full object-cover' />
                                            ) : (
                                                <Building2 className='w-6 h-6 text-slate-200' />
                                            )}
                                        </div>
                                        <div className='min-w-0'>
                                            <h3 className='font-bold text-slate-900 text-base group-hover:text-primary transition-colors leading-tight mb-1 truncate'>
                                                {toProperCase(job?.title)}
                                            </h3>
                                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{toProperCase(singleCompany?.name)}</p>
                                        </div>
                                    </div>

                                    <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-grow'>
                                        {job?.description}
                                    </p>
                                    
                                    <div className='flex flex-wrap gap-2 pt-4 border-t border-slate-50'>
                                        <div className='px-3 py-1 bg-blue-50 text-blue-700 text-[9px] font-black rounded-full uppercase tracking-widest'>
                                            {Math.max(0, job?.position || 0) < 1 ? "0 POS" : `${Math.max(0, job?.position || 0)} POSITIONS`}
                                        </div>
                                        <div className='px-3 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo-100'>
                                            {job?.salary} LPA
                                        </div>
                                        <div className='px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest'>
                                            {job?.jobType}
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className='col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200'>
                                    <Briefcase className='w-16 h-16 text-slate-100 mx-auto mb-4' strokeWidth={1.5} />
                                    <p className='text-slate-400 font-bold uppercase tracking-widest text-xs'>No active opportunities at the moment</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default CompanyProfile
