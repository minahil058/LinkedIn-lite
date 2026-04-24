import React, { useState, useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer.jsx'
import { useSelector } from 'react-redux'
import AppliedJobTable from '../components/AppliedJobTable'
import UpdateProfileDialog from '../components/UpdateProfileDialog'
import { motion, AnimatePresence } from 'framer-motion'
import useGetAppliedJobs from '../hooks/useGetAppliedJobs'
import { UserCircle2, Mail, Phone, MapPin, FileText, UploadCloud, Camera, Info, Briefcase, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    // FETCH APPLIED JOBS ON MOUNT
    useGetAppliedJobs();

    const { user = null } = useSelector(store => store?.auth || {});
    const [open, setOpen] = useState(false);
    const [banner, setBanner] = useState(null);
    const bannerRef = React.useRef(null);
    const navigate = useNavigate();

    // Utility for proper case
    const toProperCase = (str) => str ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBanner(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDownload = async (url, fileName) => {
        if (!url) return;
        
        try {
            const secureUrl = url.replace("http://", "https://");
            const response = await fetch(secureUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${fileName}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download error:", error);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const [activeTab, setActiveTab] = useState(user?.role === 'recruiter' ? 'about' : 'applied');

    if (!user) return null;

    const tabs = user?.role === 'recruiter' ? [
        { id: 'about', label: 'About Brand', icon: <Info className='w-4 h-4' /> },
        { id: 'jobs', label: 'My Postings', icon: <Briefcase className='w-4 h-4' /> },
        { id: 'pipeline', label: 'Active Pipeline', icon: <Users className='w-4 h-4' /> }
    ] : [
        { id: 'details', label: 'Profile Details', icon: <UserCircle2 className='w-4 h-4' /> },
        { id: 'applied', label: 'Applied Jobs', icon: <FileText className='w-4 h-4' /> }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
            {/* Noise Overlay */}
            <div className='absolute inset-0 opacity-[0.015] pointer-events-none' style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}></div>
            
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="profile-page"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='max-w-5xl mx-auto px-4 py-8 flex-1 w-full relative z-10'
                >
                    <motion.div 
                        className='bg-white rounded-[2rem] border border-slate-50 shadow-md overflow-hidden'
                    >
                        {/* Banner: Compact slate background with Dynamic Background Support */}
                        <div 
                            className='h-32 bg-slate-100/50 relative overflow-hidden border-b border-slate-100'
                            style={{ 
                                backgroundImage: banner || user?.profile?.banner ? `url(${banner || user?.profile?.banner})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent'></div>
                            <div className='absolute top-4 right-4 z-20 flex gap-2'>
                                <input type="file" accept="image/*" ref={bannerRef} onChange={handleBannerChange} className='hidden' />
                                <button 
                                    onClick={() => bannerRef.current.click()}
                                    className='flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-slate-700 text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-white transition-all'
                                >
                                    <Camera className='w-3.5 h-3.5' strokeWidth={1.5} />
                                    Edit Cover
                                </button>
                            </div>
                        </div>

                        <div className='px-6 md:px-10 pb-8'>
                            <div className='relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 gap-4'>
                                <div className='p-1 bg-white rounded-3xl shadow-lg border border-slate-50'>
                                    <div className='w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center border-4 border-white text-primary text-xl font-bold overflow-hidden shadow-inner'>
                                        {user?.profile?.profilePhoto ? (
                                            <img src={user?.profile?.profilePhoto} alt="profile" className='w-full h-full object-cover' />
                                        ) : (
                                            <UserCircle2 className='w-12 h-12 text-slate-300' strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>
                                
                                <div className='flex items-center gap-3 mb-1'>
                                    {user?.role === 'recruiter' && (
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate("/admin/jobs")}
                                            className='px-5 py-2 rounded-xl bg-blue-600 text-white font-black text-[10px] shadow-lg shadow-blue-100 uppercase tracking-widest flex items-center gap-2'
                                        >
                                            <Users className='w-3.5 h-3.5' />
                                            Manage Talent
                                        </motion.button>
                                    )}
                                    <motion.button 
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setOpen(true)}
                                        className='px-5 py-2 rounded-xl bg-white hover:bg-slate-50 transition-all border border-slate-200 font-black text-slate-600 text-[10px] shadow-sm uppercase tracking-widest'
                                    >
                                        Edit {user?.role === 'recruiter' ? 'Brand' : 'Profile'}
                                    </motion.button>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-2xl font-black text-slate-900 tracking-tight uppercase'>{toProperCase(user?.name)}</h1>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${user?.role === 'recruiter' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        {user?.role}
                                    </span>
                                </div>
                                <p className='text-slate-500 text-xs mt-1.5 leading-relaxed max-w-2xl font-medium'>{user?.profile?.bio || "Crafting a professional story..."}</p>
                                
                                <div className='flex flex-wrap gap-6 mt-6'>
                                    <div className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                                        <Mail className='w-3.5 h-3.5' strokeWidth={2} />
                                        {user?.email}
                                    </div>
                                    {user?.phoneNumber && (
                                        <div className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                                            <Phone className='w-3.5 h-3.5' strokeWidth={2} />
                                            {user?.phoneNumber}
                                        </div>
                                    )}
                                    <div className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                                        <MapPin className='w-3.5 h-3.5' strokeWidth={2} />
                                        {toProperCase(user?.profile?.location) || "Global Headquarters"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Unified SaaS Tabs */}
                        <div className='px-10 border-t border-slate-50 bg-slate-50/30'>
                            <div className='flex items-center gap-8'>
                                {tabs.map((tab) => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="activeTab" className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full'></motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <div className='mt-10'>
                        <AnimatePresence mode="wait">
                            {activeTab === 'about' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className='grid grid-cols-1 md:grid-cols-2 gap-6'
                                >
                                    <section className='p-8 rounded-[2rem] bg-white border border-slate-50 shadow-md'>
                                        <h2 className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Brand Narrative</h2>
                                        <p className='text-sm text-slate-600 leading-relaxed font-medium'>{user?.profile?.bio || "No brand story provided yet."}</p>
                                    </section>
                                    <section className='p-8 rounded-[2rem] bg-white border border-slate-50 shadow-md'>
                                        <h2 className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Company Stats</h2>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center'>
                                                <p className='text-2xl font-black text-slate-900'>1</p>
                                                <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1'>Active Jobs</p>
                                            </div>
                                            <div className='p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center'>
                                                <p className='text-2xl font-black text-slate-900'>1</p>
                                                <p className='text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1'>Applicants</p>
                                            </div>
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'jobs' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className='bg-white rounded-[2rem] border border-slate-50 p-8 shadow-md text-center py-20'
                                >
                                    <Briefcase className='w-12 h-12 text-slate-200 mx-auto mb-4' />
                                    <h3 className='text-xl font-black text-slate-900 uppercase tracking-tight'>Manage Job Postings</h3>
                                    <p className='text-slate-500 text-xs font-medium mt-2'>Review and update your active listings in the portal.</p>
                                    <button onClick={() => navigate("/admin/jobs")} className='mt-6 px-6 py-2.5 bg-slate-900 text-white font-black text-[10px] rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-all'>Go to Dashboard</button>
                                </motion.div>
                            )}

                            {activeTab === 'pipeline' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className='bg-white rounded-[2rem] border border-slate-50 p-8 shadow-md text-center py-20'
                                >
                                    <Users className='w-12 h-12 text-slate-200 mx-auto mb-4' />
                                    <h3 className='text-xl font-black text-slate-900 uppercase tracking-tight'>Elite Talent Pipeline</h3>
                                    <p className='text-slate-500 text-xs font-medium mt-2'>Access all applicants and manage shortlisting status.</p>
                                    <button onClick={() => navigate("/admin/jobs")} className='mt-6 px-6 py-2.5 bg-blue-600 text-white font-black text-[10px] rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-all'>Review Applicants</button>
                                </motion.div>
                            )}

                            {activeTab === 'details' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className='grid grid-cols-1 md:grid-cols-2 gap-6'
                                >
                                    <section className='p-8 rounded-[2rem] bg-white border border-slate-50 shadow-md'>
                                        <h2 className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Technical Skills</h2>
                                        <div className='flex flex-wrap gap-2'>
                                            {user?.profile?.skills?.length > 0 ? (
                                                user?.profile?.skills?.map((item, index) => (
                                                    <span key={index} className='px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-wider'>{item}</span>
                                                ))
                                            ) : <p className='text-xs text-slate-400 italic'>No skills highlighted.</p>}
                                        </div>
                                    </section>
                                    <section className='p-8 rounded-[2rem] bg-white border border-slate-50 shadow-md'>
                                        <h2 className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4'>Resume Asset</h2>
                                        {user?.profile?.resume ? (
                                            <div className='flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100'>
                                                <FileText className='w-8 h-8 text-blue-600' />
                                                <div className='min-w-0 flex-1'>
                                                    <p className='text-xs font-black text-slate-900 truncate'>{user?.profile?.resumeOriginalName}</p>
                                                    <button onClick={() => window.open(user?.profile?.resume, '_blank')} className='text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline mt-1'>Download PDF</button>
                                                </div>
                                            </div>
                                        ) : <p className='text-xs text-slate-400 italic'>No resume linked.</p>}
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'applied' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className='space-y-6'
                                >
                                    <div className='flex items-center gap-3 px-2'>
                                        <div className='w-1 h-5 bg-blue-600 rounded-full'></div>
                                        <h2 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Application History</h2>
                                    </div>
                                    <AppliedJobTable />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.main>
            </AnimatePresence>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
            <Footer />
        </div>
    )
}

export default Profile
