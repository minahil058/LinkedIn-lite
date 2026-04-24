import React, { useEffect, useState } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer.jsx'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '../redux/jobSlice'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Briefcase, DollarSign, Users, CheckCircle2, ChevronRight, Info, Loader2, Sparkles, LogIn } from 'lucide-react'
import BackButton from '../components/shared/BackButton'
import ApplyJobModal from '../components/ApplyJobModal'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [open, setOpen] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    // Proper Case Utility
    const toProperCase = (str) => str ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";

    if (!singleJob) return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50'>
            <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' strokeWidth={1.5} />
            <p className='font-bold text-slate-400 text-sm'>Syncing opportunities...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
            {/* Noise Overlay */}
            <div className='absolute inset-0 opacity-[0.015] pointer-events-none' style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}></div>
            
            <Navbar />
            <main className='max-w-7xl mx-auto px-4 py-8 flex-1 w-full relative z-10'>
                
                {/* TOP BAR with Back Button */}
                <div className='mb-6'>
                    <BackButton />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    
                    {/* LEFT COLUMN: Main Content */}
                    <div className='lg:col-span-2 space-y-4'>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='bg-white rounded-3xl p-6 md:p-10 shadow-md border border-slate-50'
                        >
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
                                <div className='space-y-3'>
                                    <h1 className='text-xl md:text-2xl font-medium text-slate-900 leading-tight tracking-tight'>
                                        {toProperCase(singleJob?.title)}
                                    </h1>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <span className='px-3 py-1 rounded-full bg-slate-50 text-slate-500 font-bold text-[9px] border border-slate-100 uppercase tracking-widest'>
                                            {singleJob?.jobType}
                                        </span>
                                        <span className='px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[9px] border border-indigo-100 uppercase tracking-widest'>
                                            {Math.max(0, singleJob?.position || 0)} POSITIONS
                                        </span>
                                        <span className='px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[9px] border border-emerald-100 uppercase tracking-widest'>
                                            {singleJob?.salary} LPA
                                        </span>
                                    </div>
                                </div>
                                {user ? (
                                    user.role === 'recruiter' ? null : (
                                        <motion.button
                                            whileHover={!isApplied ? { scale: 1.02 } : {}}
                                            whileTap={!isApplied ? { scale: 0.98 } : {}}
                                            onClick={isApplied ? null : () => setOpen(true)}
                                            disabled={isApplied}
                                            className={`relative overflow-hidden px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                                isApplied 
                                                ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100' 
                                                : 'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/5'
                                            }`}
                                        >
                                            {isApplied ? (
                                                <>
                                                    <CheckCircle2 className='w-4 h-4' strokeWidth={1.5} />
                                                    APPLIED
                                                </>
                                            ) : (
                                                <>
                                                    APPLY NOW
                                                    <ChevronRight className='w-4 h-4' strokeWidth={1.5} />
                                                </>
                                            )}
                                        </motion.button>
                                    )
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/login')}
                                        className='px-8 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm shadow-md flex items-center gap-2'
                                    >
                                        LOGIN TO APPLY
                                        <LogIn className='w-4 h-4' />
                                    </motion.button>
                                )}
                            </div>

                            <div className='space-y-8'>
                                <section>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='w-1 h-5 bg-primary rounded-full'></div>
                                        <h2 className='text-lg font-bold text-gray-900 uppercase tracking-tight'>Job Description</h2>
                                    </div>
                                    <p className='text-gray-500 leading-relaxed text-sm font-medium'>
                                        {singleJob?.description}
                                    </p>
                                </section>

                                <section>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='w-1 h-5 bg-primary rounded-full'></div>
                                        <h2 className='text-lg font-bold text-gray-900 uppercase tracking-tight'>Key Requirements</h2>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        {singleJob?.requirements && singleJob.requirements.length > 0 ? (
                                            singleJob.requirements.map((req, index) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    key={index} 
                                                    className='flex items-start gap-3 bg-gray-50/30 p-3 rounded-lg border border-gray-100 group hover:border-primary/20 transition-all'
                                                >
                                                    <div className='mt-0.5 p-0.5 bg-primary/5 rounded-md group-hover:bg-primary group-hover:text-white transition-colors'>
                                                        <CheckCircle2 className='w-3 h-3 text-primary group-hover:text-white' strokeWidth={1.5} />
                                                    </div>
                                                    <span className='text-gray-500 font-semibold text-[11px] leading-tight'>{req}</span>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className='md:col-span-2 p-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200'>
                                                <Info className='w-5 h-5 text-gray-300 mx-auto mb-1' strokeWidth={1.5} />
                                                <p className='text-gray-400 font-bold italic text-[10px]'>No specific requirements listed</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className='space-y-4'>
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='bg-white rounded-2xl p-4 shadow-premium border border-gray-100 sticky top-24'
                        >
                            <h2 className='text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]'>Job Overview</h2>
                            
                            <div className='space-y-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center'>
                                        <DollarSign className='w-5 h-5 text-blue-600' strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Salary</p>
                                        <p className='text-base font-bold text-gray-900'>{singleJob?.salary} LPA</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center'>
                                        <Briefcase className='w-5 h-5 text-purple-600' strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Experience</p>
                                        <p className='text-base font-bold text-gray-900'>{singleJob?.experienceLevel} Years</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center'>
                                        <Calendar className='w-5 h-5 text-orange-600' strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Posted Date</p>
                                        <p className='text-base font-bold text-gray-900'>{singleJob?.createdAt?.split("T")[0]}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center'>
                                        <Users className='w-5 h-5 text-emerald-600' strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Applicants</p>
                                        <p className='text-base font-bold text-gray-900'>{singleJob?.applications?.length || 0} Candidates</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 border-t border-gray-50 pt-6 mt-2'>
                                    <div className='w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100'>
                                        {singleJob?.company?.logo ? <img src={singleJob?.company?.logo} className='w-full h-full object-cover' /> : <MapPin className='w-5 h-5 text-gray-400' strokeWidth={1.5} />}
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Company</p>
                                        <p className='text-base font-bold text-gray-900 truncate'>{singleJob?.company?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </main>

            <ApplyJobModal 
                open={open} 
                setOpen={setOpen} 
                jobId={jobId} 
                singleJob={singleJob} 
            />

            <Footer />
        </div>
    )
}

export default JobDescription

