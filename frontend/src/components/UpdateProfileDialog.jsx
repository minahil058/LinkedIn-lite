import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant'
import { setUser } from '../redux/authSlice'
import { toast } from 'sonner'
import { Loader2, X, Image as ImageIcon, User, Mail, Phone, FileText, Sparkles, ChevronRight, MapPin, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        location: user?.profile?.location || "",
        resume: null,
        profilePhoto: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const resumeChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, resume: file })
    }

    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, profilePhoto: file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("location", input.location);
        
        if (input.resume instanceof File) {
            formData.append("resume", input.resume);
        }
        if (input.profilePhoto instanceof File) {
            formData.append("profilePhoto", input.profilePhoto);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    const isRecruiter = user?.role === 'recruiter';

    const inputVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1, 
            y: 0,
            transition: { delay: i * 0.1 }
        })
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        
                        <div className="px-10 pt-10 pb-6 flex items-center justify-between">
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-primary/10 rounded-xl'>
                                    {isRecruiter ? <Building2 className='w-5 h-5 text-primary' /> : <Sparkles className='w-5 h-5 text-primary' />}
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Update {isRecruiter ? 'Brand' : 'Profile'}</h2>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                                <X className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitHandler} className="px-10 pb-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{isRecruiter ? 'Company Name' : 'Full Name'}</label>
                                    <div className='relative'>
                                        {isRecruiter ? <Building2 className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' /> : <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />}
                                        <input type="text" name="name" value={input.name} onChange={changeEventHandler} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800" />
                                    </div>
                                </motion.div>
                                <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{isRecruiter ? 'Official Email' : 'Email Address'}</label>
                                    <div className='relative'>
                                        <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800" />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Phone Number</label>
                                    <div className='relative'>
                                        <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input type="text" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800" />
                                    </div>
                                </motion.div>

                                <motion.div custom={2.5} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{isRecruiter ? 'Office Location' : 'Current Location'}</label>
                                    <div className='relative'>
                                        <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input type="text" name="location" value={input.location} onChange={changeEventHandler} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800" placeholder="e.g. London, UK" />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{isRecruiter ? 'Brand Narrative' : 'Professional Bio'}</label>
                                <textarea name="bio" value={input.bio} onChange={changeEventHandler} rows="3" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800 resize-none" placeholder={isRecruiter ? "Describe your company culture..." : "Tell us about yourself..."} />
                            </motion.div>

                            {!isRecruiter && (
                                <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Skills (comma separated)</label>
                                    <div className='relative'>
                                        <Sparkles className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                        <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary/30 focus:bg-white transition-all font-bold text-gray-800" placeholder="React, Node, Tailwind..." />
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{isRecruiter ? 'Brand Logo' : 'Profile Avatar'}</label>
                                    <div className="relative">
                                        <input type="file" accept="image/*" onChange={photoChangeHandler} className="hidden" id="photo-upload" />
                                        <label htmlFor="photo-upload" className="flex items-center gap-3 w-full px-5 py-4 bg-primary/5 border border-primary/10 rounded-2xl cursor-pointer hover:bg-primary/10 transition-all">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            <span className="text-xs font-black text-primary uppercase truncate max-w-full">
                                                {input.profilePhoto?.name || (isRecruiter ? "Upload Logo" : "Upload Photo")}
                                            </span>
                                        </label>
                                    </div>
                                </motion.div>

                                {!isRecruiter && (
                                    <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible" className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resume (PDF)</label>
                                        <div className="relative">
                                            <input type="file" accept="application/pdf" onChange={resumeChangeHandler} className="hidden" id="resume-upload" />
                                            <label htmlFor="resume-upload" className="flex items-center gap-3 w-full px-5 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-100/50 transition-all">
                                                <FileText className="w-5 h-5 text-emerald-600" />
                                                <span className="text-xs font-black text-emerald-600 uppercase truncate max-w-full">
                                                    {input.resume?.name || "Upload Resume"}
                                                </span>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <motion.div custom={7} variants={inputVariants} initial="hidden" animate="visible" className="pt-6">
                                <motion.button 
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading} 
                                    type="submit" 
                                    className={`w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all ${loading ? 'animate-pulse opacity-80' : ''}`}
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            SAVE CHANGES
                                            <ChevronRight className='w-6 h-6' />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default UpdateProfileDialog
