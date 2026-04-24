import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer.jsx'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/authSlice'
import { motion } from 'framer-motion'
import { Loader2, User, Briefcase, CheckCircle2 } from 'lucide-react'
import { USER_API_END_POINT } from '../../utils/constant'

const Signup = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
    });
    
    const [loading, setLocalLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const setRole = (role) => {
        setInput({ ...input, role });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            return toast.error("Please select a role (Candidate or Recruiter)");
        }
        
        try {
            setLocalLoading(true);
            dispatch(setLoading(true));
            
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message || "Account created!");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLocalLoading(false);
            dispatch(setLoading(false));
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className='flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden'>
                {/* Subtle Background Elements */}
                <div className='absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl'></div>
                <div className='absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl'></div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-50 relative z-10'
                >
                    <div className="text-center mb-10">
                        <h1 className='text-3xl font-black text-slate-900 tracking-tight uppercase'>Join JobPortal</h1>
                        <p className='text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest'>Make the most of your professional life</p>
                    </div>
                    
                    <form onSubmit={submitHandler} className='space-y-5'>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2'>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                placeholder="John Doe"
                                className='w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2'>Official Email</label>
                            <input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="email@example.com"
                                className='w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2'>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="1234567890"
                                className='w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2'>Password (6+ characters)</label>
                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Create password"
                                className='w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className='pt-2'>
                            <p className='text-xs font-bold text-slate-800 mb-4 ml-1'>Join as a:</p>
                            <div className='flex items-center gap-4'>
                                <div 
                                    onClick={() => setRole('candidate')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-5 border rounded-2xl cursor-pointer transition-all duration-300 relative group ${input.role === 'candidate' ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${input.role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                                        <User className='w-5 h-5' />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'candidate' ? 'text-blue-600' : 'text-slate-500'}`}>Candidate</span>
                                    {input.role === 'candidate' && (
                                        <div className='absolute top-2 right-2'>
                                            <CheckCircle2 className='w-3.5 h-3.5 text-blue-600' />
                                        </div>
                                    )}
                                </div>

                                <div 
                                    onClick={() => setRole('recruiter')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-5 border rounded-2xl cursor-pointer transition-all duration-300 relative group ${input.role === 'recruiter' ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${input.role === 'recruiter' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                                        <Briefcase className='w-5 h-5' />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'recruiter' ? 'text-blue-600' : 'text-slate-500'}`}>Recruiter</span>
                                    {input.role === 'recruiter' && (
                                        <div className='absolute top-2 right-2'>
                                            <CheckCircle2 className='w-3.5 h-3.5 text-blue-600' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                disabled={loading} 
                                type='submit' 
                                className='w-full py-4 bg-[#006097] text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-md transition-all hover:bg-[#004b76] active:scale-95 flex items-center justify-center gap-2'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                        CREATING ACCOUNT...
                                    </>
                                ) : "AGREE & JOIN"}
                            </button>
                        </div>
                    </form>

                    <div className='mt-8 pt-8 border-t border-slate-50 text-center'>
                        <p className='text-slate-500 text-xs font-medium'>
                            Already on JobPortal? 
                            <Link to="/login" className='text-primary font-black ml-1 hover:underline'>Sign In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default Signup
