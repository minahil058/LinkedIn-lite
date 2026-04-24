import React from 'react'
import Navbar from '../components/shared/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/shared/Footer.jsx'
import useGetAllJobs from '../hooks/useGetAllJobs'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Job from '../components/Job'
import { motion } from 'framer-motion'
import { setSearchedQuery } from '../redux/jobSlice'
import { toast } from 'sonner'

const Home = () => {
    // FETCH JOBS ON MOUNT
    useGetAllJobs();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allJobs = [] } = useSelector(store => store.job || {});

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f2f0]">
            <Navbar />
            <main className="flex-1">
                <HeroSection />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='max-w-7xl mx-auto px-4 py-16'
                >
                    <div className='flex items-center justify-between mb-8'>
                        <h1 className='text-3xl font-bold text-gray-800'>Latest Job Openings</h1>
                        <Link
                            to='/jobs'
                            onClick={() => dispatch(setSearchedQuery(""))}
                            className='text-primary font-bold hover:underline transition-all hover:scale-105 active:scale-95'
                        >
                            See all jobs
                        </Link>
                    </div>

                    {allJobs.length <= 0 ? (
                        <div className='bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 font-bold'>
                            NO JOBS POSTED YET
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch'>
                            {allJobs.slice(0, 6).map((job) => (
                                <motion.div
                                    key={job?._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-gray-100">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-light text-gray-800 mb-8"
                        >
                            Find the right job or internship for you
                        </motion.h2>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="flex flex-wrap gap-3"
                        >
                            {['Engineering', 'Business Development', 'Finance', 'Administrative Assistant', 'Retail Associate', 'Customer Service', 'Operations', 'Information Technology', 'Marketing', 'Human Resources'].map((item) => (
                                <motion.button
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                    key={item}
                                    onClick={() => {
                                        dispatch(setSearchedQuery(item));
                                        navigate("/jobs");
                                    }}
                                    className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-primary hover:border-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                        <div className="relative bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-premium flex flex-col items-center text-center">
                            <div className="w-full h-56 mb-8 rounded-3xl overflow-hidden shadow-inner bg-gray-50 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                                    alt="Professional Community"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Join Our Community</h3>
                            <p className="text-gray-500 text-sm font-medium mb-8 max-w-xs">Get the latest job alerts and career advice delivered straight to your inbox.</p>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const email = e.target.email.value;
                                    if (!email.trim()) {
                                        return toast.error("Please enter a valid email address.");
                                    }
                                    toast.success("Welcome to the community!");
                                    e.target.reset();
                                }}
                                className="w-full flex flex-col gap-3 items-center"
                            >
                                <div className="w-full flex flex-col md:flex-row gap-2">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your professional email"
                                        className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none text-sm font-bold transition-all text-center md:text-left"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all text-xs uppercase tracking-widest"
                                    >
                                        Subscribe
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Home
