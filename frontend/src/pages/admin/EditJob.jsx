import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '../../utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Edit3, Save, Sparkles } from 'lucide-react'
import BackButton from '../../components/shared/BackButton'

const EditJob = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0
    });

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const job = allJobs.find(job => job._id === params.id);
        if (job) {
            setInput({
                title: job.title || "",
                description: job.description || "",
                requirements: job.requirements?.join(",") || "",
                salary: job.salary || "",
                location: job.location || "",
                jobType: job.jobType || "",
                experience: job.experienceLevel || "",
                position: job.position || 0
            });
        }
    }, [params.id, allJobs]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="edit-job-page"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className='max-w-4xl mx-auto px-4 py-12 flex-1 w-full'
                >
                    <div className='mb-10 flex items-center gap-6'>
                        <BackButton />
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <Edit3 className='w-5 h-5 text-primary' />
                                <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Modify Listing</h1>
                            </div>
                            <p className='text-gray-500 font-bold'>Refine the requirements and details for this career role.</p>
                        </div>
                    </div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-premium'
                    >
                        <form onSubmit={submitHandler} className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Job Designation</label>
                                <input type="text" name="title" value={input.title} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Primary Location</label>
                                <input type="text" name="location" value={input.location} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3 md:col-span-2'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Job Mission (Description)</label>
                                <textarea name="description" value={input.description} onChange={changeEventHandler} rows="4" className='input-field resize-none' required />
                            </div>
                            <div className='space-y-3 md:col-span-2'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Core Competencies (Comma Separated)</label>
                                <input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Salary Package (LPA)</label>
                                <input type="text" name="salary" value={input.salary} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Experience Needed</label>
                                <input type="text" name="experience" value={input.experience} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Available Slots</label>
                                <input type="number" name="position" min="1" value={input.position} onChange={changeEventHandler} className='input-field' required />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Employment Nature</label>
                                <input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} className='input-field' required />
                            </div>

                            <div className='md:col-span-2 pt-8'>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading} 
                                    type="submit" 
                                    className='w-full bg-primary text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 transition-all disabled:opacity-50'
                                >
                                    {loading ? (
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                    ) : (
                                        <>
                                            <Save className='w-5 h-5' />
                                            Update Career Listing
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default EditJob
