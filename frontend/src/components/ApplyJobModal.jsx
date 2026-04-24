import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Clock, FileText, Loader2, ChevronRight, PenTool, UploadCloud, AlertCircle, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { APPLICATION_API_END_POINT, USER_API_END_POINT } from '../utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '../redux/jobSlice'
import { setUser } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'

const ApplyJobModal = ({ open, setOpen, jobId, singleJob }) => {
    const [loading, setLoading] = useState(false);
    const [updatingResume, setUpdatingResume] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const [applicationData, setApplicationData] = useState({
        coverLetter: "",
        experience: ""
    });

    const changeEventHandler = (e) => {
        setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
    }

    const handleResumeUpdate = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("name", user.name);
        formData.append("email", user.email);

        try {
            setUpdatingResume(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Resume updated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update resume.");
        } finally {
            setUpdatingResume(false);
        }
    }

    const applyJobHandler = async (e) => {
        e.preventDefault();

        // Validation: If user is not logged in, redirect to /login
        if (!user) {
            toast.error("You must be logged in to apply.");
            navigate("/login");
            return;
        }

        if (!user?.profile?.resume) {
            return toast.error("Please upload your resume before applying.");
        }

        if (applicationData.coverLetter.length < 50) {
            return toast.error("Cover letter must be at least 50 characters.");
        }
        try {
            setLoading(true);
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, applicationData, { withCredentials: true });
            
            if (res.data.success) {
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications, {applicant:user?._id}]};
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
                setOpen(false);
                navigate("/profile");
            }
        } catch (error) {
            console.log(error);
            // If backend returns unauthorized, redirect to login
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
            } else {
                toast.error(error.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md'>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className='p-[1px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-h-[85vh] flex flex-col'
                    >
                        <div className='bg-white rounded-[1.45rem] overflow-hidden relative flex flex-col h-full'>
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none"></div>

                            <div className='p-6 md:p-8 flex flex-col h-full'>
                                <div className='flex items-center justify-between mb-6 shrink-0'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm'>
                                            <Sparkles className='w-5 h-5 text-blue-600' />
                                        </div>
                                        <div>
                                            <h2 className='text-xl font-black text-slate-900 tracking-tight uppercase'>Complete Application</h2>
                                            <p className='text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5'>Portal Access: <span className='text-blue-600'>{singleJob?.title}</span></p>
                                        </div>
                                    </div>
                                    <button onClick={() => setOpen(false)} className='p-2 hover:bg-slate-50 rounded-full transition-colors group'>
                                        <X className='w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors' />
                                    </button>
                                </div>

                                <form onSubmit={applyJobHandler} className='flex flex-col flex-1 min-h-0'>
                                    <div className='flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar'>
                                        <div className='space-y-1.5'>
                                            <div className='flex items-center gap-2 ml-1'>
                                                <Clock className='w-2.5 h-2.5 text-slate-400' />
                                                <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Years of Experience</label>
                                            </div>
                                            <input 
                                                type="text" 
                                                name="experience"
                                                value={applicationData.experience}
                                                onChange={changeEventHandler}
                                                placeholder="e.g. 2.5 Years"
                                                className='w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-xs'
                                                required
                                            />
                                        </div>

                                        <div className='space-y-1.5'>
                                            <div className='flex items-center gap-2 ml-1'>
                                                <PenTool className='w-2.5 h-2.5 text-slate-400' />
                                                <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Cover Letter (Min 50 Chars)</label>
                                            </div>
                                            <textarea 
                                                name="coverLetter"
                                                value={applicationData.coverLetter}
                                                onChange={changeEventHandler}
                                                rows="4"
                                                placeholder="Tell us why you're a great fit for this role..."
                                                className='w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800 text-xs resize-none'
                                                required
                                            />
                                            <div className='flex flex-col gap-1.5 px-1'>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-[8px] font-black text-slate-400 uppercase tracking-widest'>
                                                        PROGRESS: <span className={applicationData.coverLetter.length < 50 ? 'text-blue-500' : 'text-emerald-500'}>{applicationData.coverLetter.length} / 50</span>
                                                    </p>
                                                </div>
                                                <div className='w-full h-1 bg-slate-100 rounded-full overflow-hidden'>
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min((applicationData.coverLetter.length / 50) * 100, 100)}%` }}
                                                        className='h-full bg-gradient-to-r from-blue-400 to-indigo-600'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Portfolio/Resume Section */}
                                        <div className='space-y-2'>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleResumeUpdate} 
                                                className='hidden' 
                                                accept=".pdf,.doc,.docx"
                                            />
                                            
                                            {user?.profile?.resume ? (
                                                <div className='flex flex-col gap-2'>
                                                    <div 
                                                        onClick={() => window.open(user?.profile?.resume, '_blank')}
                                                        title="Click to view your linked resume"
                                                        className='p-3 bg-blue-50/40 rounded-xl border border-blue-100/50 flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-50/60 transition-all group'
                                                    >
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-blue-100 shadow-sm'>
                                                                <FileText className='w-4 h-4 text-blue-600' />
                                                            </div>
                                                            <div className='min-w-0'>
                                                                <p className='text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1'>Verified Identity</p>
                                                                <p className='text-xs font-black text-slate-900 truncate max-w-[140px] leading-none'>{user?.profile?.resumeOriginalName || "My-Portfolio.pdf"}</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    fileInputRef.current.click();
                                                                }}
                                                                className='p-1.5 hover:bg-white rounded-lg text-blue-500 transition-all flex items-center gap-1.5'
                                                                title="Replace this resume"
                                                            >
                                                                {updatingResume ? <RefreshCw className='w-3 h-3 animate-spin' /> : <UploadCloud className='w-3 h-3' />}
                                                                <span className='text-[8px] font-black uppercase tracking-tighter'>Replace</span>
                                                            </button>
                                                            <div className='flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-white px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest shadow-sm shrink-0'>
                                                                <div className='w-1 h-1 rounded-full bg-emerald-500 animate-pulse' />
                                                                Active
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='p-4 bg-orange-50/50 rounded-xl border border-orange-100 border-dashed flex flex-col items-center gap-3 text-center'>
                                                    <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
                                                        <AlertCircle className='w-5 h-5 text-orange-600' />
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-xs font-black text-slate-900 uppercase tracking-tight'>No Resume Found</p>
                                                        <p className='text-[10px] text-slate-500 font-medium'>Please link your portfolio before applying</p>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => navigate('/profile')}
                                                        className='px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-orange-700 transition-all'
                                                    >
                                                        Upload Now
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='pt-6 shrink-0'>
                                        <button 
                                            disabled={loading || updatingResume || !user?.profile?.resume}
                                            type="submit" 
                                            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest'
                                        >
                                            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                                                <>
                                                    SEND APPLICATION
                                                    <ChevronRight className='w-4 h-4 translate-y-[0.5px]' />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ApplyJobModal
