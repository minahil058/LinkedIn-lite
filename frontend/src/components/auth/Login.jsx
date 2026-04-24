import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer.jsx'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../../redux/authSlice'
import { motion } from 'framer-motion'
import { User, Briefcase, CheckCircle2, Loader2 } from 'lucide-react'
import { USER_API_END_POINT } from '../../utils/constant'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    
    const [localLoading, setLocalLoading] = useState(false);
    const { loading = false } = useSelector(store => store?.auth || {});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const setRole = (role) => {
        setInput({ ...input, role });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("1. Login Button Clicked!", input);
        if (!input.role) {
            return toast.error("Please select your role (Candidate/Recruiter)");
        }

        try {
            setLocalLoading(true);
            dispatch(setLoading(true));
            
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            
            console.log("2. Login Success:", res.data);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || `Welcome back!`);
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log("3. Login Error details:", error.response);
            toast.error(error.response?.data?.message || "Login failed.");
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
                    <div className="mb-10 text-center">
                        <h1 className='text-3xl font-black text-slate-900 tracking-tight uppercase'>Sign In</h1>
                        <p className='text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest'>Stay updated on your professional world</p>
                    </div>
                    
                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className="space-y-2">
                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2'>Official Email</label>
                            <input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="email@example.com"
                                className='w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className='flex justify-between items-center px-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Access Key</label>
                                <button type='button' className='text-[9px] font-bold text-primary hover:underline uppercase tracking-tighter'>Forgot Password?</button>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className='w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                                required
                            />
                        </div>

                        <div className='pt-2'>
                            <p className='text-xs font-bold text-slate-800 mb-4 ml-1'>Join as a:</p>
                            <div className='flex items-center gap-4'>
                                <div 
                                    onClick={() => setRole('candidate')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-6 border rounded-2xl cursor-pointer transition-all duration-300 relative group ${input.role === 'candidate' ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${input.role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                                        <User className='w-6 h-6' />
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${input.role === 'candidate' ? 'text-blue-600' : 'text-slate-500'}`}>Candidate</span>
                                    {input.role === 'candidate' && (
                                        <div className='absolute top-2 right-2'>
                                            <CheckCircle2 className='w-4 h-4 text-blue-600' />
                                        </div>
                                    )}
                                </div>

                                <div 
                                    onClick={() => setRole('recruiter')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-6 border rounded-2xl cursor-pointer transition-all duration-300 relative group ${input.role === 'recruiter' ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${input.role === 'recruiter' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                                        <Briefcase className='w-6 h-6' />
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${input.role === 'recruiter' ? 'text-blue-600' : 'text-slate-500'}`}>Recruiter</span>
                                    {input.role === 'recruiter' && (
                                        <div className='absolute top-2 right-2'>
                                            <CheckCircle2 className='w-4 h-4 text-blue-600' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={localLoading || loading} 
                            type='submit' 
                            className='w-full py-4 bg-[#006097] text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-md transition-all hover:bg-[#004b76] active:scale-95 flex items-center justify-center gap-2'
                        >
                            {(localLoading || loading) ? (
                                <>
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                    JOINING...
                                </>
                            ) : "AGREE & JOIN"}
                        </button>
                    </form>

                    <div className='mt-10 pt-8 border-t border-slate-50 text-center'>
                        <p className='text-slate-500 text-xs font-medium'>
                            Don't have an account? 
                            <Link to="/signup" className='text-primary font-black ml-1 hover:underline'>Create Profile</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default Login
