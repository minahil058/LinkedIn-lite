import React, { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Sparkles, Loader2, Briefcase, ChevronRight } from 'lucide-react'
import BackButton from '../../components/shared/BackButton'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const { user } = useSelector(store => store.auth);

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (e) => {
        setInput({ ...input, companyId: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
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
                    key="post-job-page"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className='max-w-4xl mx-auto px-4 py-12 flex-1 w-full'
                >
                    <div className='mb-10 flex items-center gap-6'>
                        <BackButton />
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <Sparkles className='w-5 h-5 text-primary' />
                                <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Post Career Opportunity</h1>
                            </div>
                            <p className='text-gray-500 font-bold'>Fill in the details to connect with elite talent worldwide.</p>
                        </div>
                    </div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-premium'
                    >
                        <form onSubmit={submitHandler} className='space-y-10'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Job Designation</label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            name="title"
                                            value={input.title}
                                            onChange={changeEventHandler}
                                            className='input-field pl-12'
                                            placeholder='e.g. Senior Frontend Architect'
                                            required
                                        />
                                        <Briefcase className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300' />
                                    </div>
                                </div>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Primary Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className='input-field'
                                        placeholder='City, Remote, or Hybrid'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Job Mission (Description)</label>
                                <textarea
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    rows="4"
                                    className='input-field resize-none'
                                    placeholder='Define the core responsibilities and vision for this role...'
                                    required
                                />
                            </div>

                            <div className='space-y-3'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Core Competencies (Comma separated)</label>
                                <input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className='input-field'
                                    placeholder='React, Cloud Architecture, Leadership...'
                                    required
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Salary Package (LPA)</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        className='input-field'
                                        placeholder='e.g. 18'
                                        required
                                    />
                                </div>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Experience Needed</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={input.experience}
                                        onChange={changeEventHandler}
                                        className='input-field'
                                        placeholder='e.g. 5+ years'
                                        required
                                    />
                                </div>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Available Slots</label>
                                    <input
                                        type="number"
                                        name="position"
                                        min="1"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className='input-field'
                                        placeholder='e.g. 3'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Employment Nature</label>
                                    <select 
                                        name="jobType" 
                                        value={input.jobType} 
                                        onChange={changeEventHandler} 
                                        className='input-field appearance-none bg-white'
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Full-time">Full-time (Permanent)</option>
                                        <option value="Part-time">Part-time (Flexible)</option>
                                        <option value="Internship">Internship (Learning)</option>
                                        <option value="Contract">Contract (Fixed Term)</option>
                                    </select>
                                </div>
                                <div className='space-y-3'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Hosting Brand</label>
                                    <select 
                                        name="companyId" 
                                        onChange={selectChangeHandler} 
                                        className='input-field appearance-none bg-white'
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select the Company</option>
                                        {
                                            companies.map((company) => (
                                                <option key={company._id} value={company._id}>{company.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {
                                companies.length === 0 && (
                                    <div className='p-4 bg-red-50 border border-red-100 rounded-2xl'>
                                        <p className='text-xs text-red-600 font-black uppercase tracking-widest text-center'>
                                            * Access restricted: Please register a corporate entity before posting.
                                        </p>
                                    </div>
                                )
                            }

                            <div className='pt-8'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || companies.length === 0}
                                    className='w-full bg-primary text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:grayscale'
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin' />
                                            DEPLOYING ROLE...
                                        </>
                                    ) : (
                                        <>
                                            Publish Career Listing
                                            <ChevronRight className='w-5 h-5' />
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

export default PostJob
