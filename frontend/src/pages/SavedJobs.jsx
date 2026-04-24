import React, { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import BackButton from '../components/shared/BackButton'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { removeSavedJob } from '../redux/jobSlice'
import { Trash2, BookmarkCheck, Briefcase, ArrowLeft } from 'lucide-react'
import useGetSavedJobs from '../hooks/useGetSavedJobs'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant'
import { toast } from 'sonner'

const SavedJobs = () => {
    // FETCH SAVED JOBS FROM BACKEND
    useGetSavedJobs();

    const { user } = useSelector(store => store.auth);
    const { savedJobs = [] } = useSelector(store => store.job || {});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // AUTH PROTECTION
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleRemove = async (jobId) => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/save/${jobId}`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(removeSavedJob(jobId));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error("Failed to remove job");
        }
    }

    if (!user) return null;

    return (
        <div className='min-h-screen flex flex-col bg-[#f8f9fb]'>
            <Navbar />
            <main className='max-w-7xl mx-auto px-4 py-12 flex-1 w-full'>
                <div className='mb-8'>
                    <motion.button 
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/jobs")}
                        className='flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition-all group'
                    >
                        <div className='p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-primary/20'>
                            <ArrowLeft className='w-4 h-4' />
                        </div>
                        <span className='uppercase tracking-widest text-[10px]'>Back to Jobs</span>
                    </motion.button>

                    <div className='flex items-center gap-3 mt-8'>
                        <div className='p-3 bg-primary/10 rounded-2xl'>
                            <BookmarkCheck className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Saved Jobs</h1>
                            <p className='text-gray-500 font-bold'>Review and manage your bookmarked opportunities.</p>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <AnimatePresence mode='popLayout'>
                        {savedJobs.length <= 0 ? (
                            <motion.div 
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-premium flex flex-col items-center'
                            >
                                <div className='w-48 h-48 mb-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden'>
                                    <img 
                                        src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop" 
                                        alt="Empty state" 
                                        className='w-full h-full object-cover opacity-60 grayscale'
                                    />
                                </div>
                                <h2 className='text-2xl font-black text-gray-900 uppercase tracking-tight mb-2'>No jobs saved yet</h2>
                                <p className='text-gray-500 font-bold mb-8 max-w-xs'>Start exploring the latest opportunities and bookmark the ones that catch your eye!</p>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/jobs")}
                                    className='bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all text-xs uppercase tracking-widest'
                                >
                                    Explore Jobs
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="saved-grid"
                                layout
                                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            >
                                {savedJobs.map((job, index) => (
                                    <motion.div
                                        key={job?._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1 }}
                                        className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-xl transition-all group'
                                    >
                                        <div className='flex items-center justify-between mb-6'>
                                            <div className='w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden'>
                                                {job?.company?.logo ? (
                                                    <img src={job?.company?.logo} alt="logo" className='w-full h-full object-cover' />
                                                ) : (
                                                    <Briefcase className='w-6 h-6 text-gray-300' />
                                                )}
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemove(job?._id)}
                                                className='p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </motion.button>
                                        </div>
                                        
                                        <div>
                                            <h3 className='text-xl font-black text-gray-900 uppercase tracking-tight mb-1 truncate'>
                                                {job?.title ? job.title.charAt(0).toUpperCase() + job.title.slice(1) : ""}
                                            </h3>
                                            <p className='text-sm font-bold text-primary uppercase tracking-widest mb-4'>{job?.company?.name}</p>
                                            
                                            <div className='flex items-center gap-2 mb-6'>
                                                <span className='px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest'>
                                                    {job?.location}
                                                </span>
                                                <span className='px-3 py-1 bg-primary/5 rounded-lg text-[10px] font-black text-primary border border-primary/10 uppercase tracking-widest'>
                                                    {job?.jobType}
                                                </span>
                                            </div>

                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate(`/description/${job?._id}`)}
                                                className='w-full py-4 bg-gray-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all'
                                            >
                                                View Details
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default SavedJobs;
