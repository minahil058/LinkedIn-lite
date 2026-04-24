import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Bookmark, MapPin, Building2, DollarSign, Briefcase, Loader2, ChevronRight } from 'lucide-react'

import { useSelector, useDispatch } from 'react-redux'
import { toggleSavedJob } from '../redux/jobSlice'
import { setUser } from '../redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { savedJobs = [] } = useSelector(store => store.job || {});
    const isBookmarked = savedJobs.some(j => j._id === job._id);

    const handleBookmark = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to save jobs.");
            return navigate("/login");
        }

        try {
            setLoading(true);
            // Explicit Full URL to avoid path issues
            const res = await axios.post(`${USER_API_END_POINT}/save/${job?._id}`, {}, { withCredentials: true });

            if (res.data.success) {
                dispatch(toggleSavedJob(job));

                const updatedUser = {
                    ...user,
                    profile: {
                        ...user.profile,
                        savedJobs: isBookmarked
                            ? user.profile.savedJobs.filter(id => id !== job._id)
                            : [...(user.profile.savedJobs || []), job._id]
                    }
                };
                dispatch(setUser(updatedUser));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log('Full Error:', error);
            if (!error.response) {
                console.error("NETWORK_OR_CORS_ERROR: Check if server is running or CORS is misconfigured.");
                toast.error("Network error. Please check your connection or server status.");
            } else {
                console.error("BOOKMARK_ERROR_RESPONSE:", error.response.data);
                toast.error(error.response.data.message || "Failed to save job");
            }
        } finally {
            setLoading(false);
        }
    }

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    // Proper Case Utility
    const toProperCase = (str) => str ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -8 }}
            onClick={() => navigate(`/description/${job?._id}`)}
            className='relative p-6 rounded-2xl bg-white border border-slate-50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col'
        >
            <div className='flex-grow'>
                {/* Header: Date and Save Button */}
                <div className='flex items-center justify-between mb-5'>
                    <span className='px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-widest'>
                        {daysAgoFunction(job?.createdAt) === 0 ? "Published Today" : `${daysAgoFunction(job?.createdAt)}d ago`}
                    </span>
                    <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={handleBookmark}
                        disabled={loading}
                        className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'bg-primary/5 text-primary' : 'bg-transparent text-slate-300 hover:text-slate-400'}`}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        ) : (
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={1.5} />
                        )}
                    </motion.button>
                </div>

                {/* Content: Logo and Info */}
                <div className='flex items-start gap-3 min-h-[48px]'>
                    <div className='w-12 h-12 min-w-[48px] rounded-xl bg-slate-50 shadow-sm border border-slate-100 flex items-center justify-center p-1.5 group-hover:border-primary/10 transition-colors overflow-hidden'>
                        {
                            job?.company?.logo ? (
                                <img 
                                    src={job?.company?.logo} 
                                    alt="logo" 
                                    className='w-full h-full object-contain'
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg></div>'; }}
                                />
                            ) : (
                                <div className='text-primary'>
                                    <Building2 className='w-5 h-5' strokeWidth={1.5} />
                                </div>
                            )
                        }
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h1 className='font-semibold text-base text-slate-900 group-hover:text-primary transition-colors leading-tight mb-0.5 truncate'>
                            {toProperCase(job?.title)}
                        </h1>
                        <div className='flex items-center gap-1.5 text-xs text-slate-500 font-medium'>
                            <span className='hover:text-primary transition-colors truncate max-w-[100px]'>{toProperCase(job?.company?.name)}</span>
                            <span className='w-0.5 h-0.5 bg-slate-300 rounded-full shrink-0'></span>
                            <div className='flex items-center gap-1 truncate'>
                                <MapPin className='w-2.5 h-2.5 shrink-0 text-slate-400' strokeWidth={1.5} />
                                <span className='truncate'>{toProperCase(job?.location)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Snippet */}
                <div className='mt-4'>
                    <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
                        {job?.description}
                    </p>
                </div>
            </div>

            {/* Badges and Call to Action */}
            <div className='mt-5 pt-4 border-t border-gray-50 flex items-center justify-between'>
                <div className='flex flex-wrap gap-1.5'>
                    <div className='px-2.5 py-1 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-full uppercase tracking-wider'>
                        {Math.max(0, job?.position)} Positions
                    </div>
                    <div className='px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded-full uppercase tracking-wider border border-indigo-100'>
                        {job?.salary} LPA
                    </div>
                </div>
                
                <div className='text-primary text-[10px] font-black flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0'>
                    DETAILS
                    <ChevronRight className='w-3 h-3' strokeWidth={1.5} />
                </div>
            </div>
        </motion.div>
    )
}

export default Job
