import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAllJobs } from '../../redux/jobSlice'
import { JOB_API_END_POINT } from '../../utils/constant'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Users, Edit3, Briefcase } from 'lucide-react'

const AdminJobs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { allJobs = [] } = useSelector(store => store.job || {});
    const { user } = useSelector(store => store.auth);
    const [filterInput, setFilterInput] = useState("");

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (user) fetchAdminJobs();
    }, [dispatch, user]);

    const filteredJobs = allJobs.filter((job) => {
        if (!filterInput) return true;
        return job?.title?.toLowerCase().includes(filterInput.toLowerCase()) || job?.company?.name?.toLowerCase().includes(filterInput.toLowerCase());
    });

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="admin-jobs-dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='max-w-7xl mx-auto px-4 py-12 flex-1 w-full'
                >
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12'>
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='p-2 bg-primary/10 rounded-xl'>
                                    <Briefcase className='w-5 h-5 text-primary' />
                                </div>
                                <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Active Job Postings</h1>
                            </div>
                            <p className='text-gray-500 font-bold'>Monitor and manage your active career opportunities.</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/admin/jobs/create")}
                            className='bg-primary text-white font-black py-4 px-8 rounded-2xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 flex items-center gap-2 uppercase tracking-widest text-xs'
                        >
                            <Plus className='w-4 h-4' />
                            Post New Opportunity
                        </motion.button>
                    </div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2rem] border border-gray-100 shadow-premium overflow-hidden'
                    >
                        <div className='p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4'>
                            <Search className='w-4 h-4 text-gray-400' />
                            <input 
                                type="text" 
                                placeholder='Search by title or company name...'
                                className='flex-1 outline-none text-sm font-bold bg-transparent text-gray-700'
                                value={filterInput}
                                onChange={(e) => setFilterInput(e.target.value)}
                            />
                        </div>

                        <div className='overflow-x-auto'>
                            <table className='w-full text-left'>
                                <thead className='bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
                                    <tr>
                                        <th className='px-8 py-5'>Employer</th>
                                        <th className='px-8 py-5'>Position Title</th>
                                        <th className='px-8 py-5'>Creation Date</th>
                                        <th className='px-8 py-5'>Candidates</th>
                                        <th className='px-8 py-5 text-right'>Operations</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-50'>
                                    {filteredJobs.map((job, index) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={job?._id} 
                                            className='hover:bg-gray-50/50 transition-colors group'
                                        >
                                            <td className='px-8 py-5'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden group-hover:border-primary/20 transition-colors'>
                                                        {job?.company?.logo ? <img src={job?.company?.logo} alt="logo" className='w-full h-full object-cover' /> : <Briefcase className='w-4 h-4 text-gray-200' />}
                                                    </div>
                                                    <span className='font-black text-gray-900 uppercase tracking-tight text-sm'>{job?.company?.name}</span>
                                                </div>
                                            </td>
                                            <td className='px-8 py-5 font-bold text-gray-700'>{job?.title}</td>
                                            <td className='px-8 py-5'>
                                                <span className='text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100'>{job?.createdAt?.split("T")[0]}</span>
                                            </td>
                                            <td className='px-8 py-5'>
                                                <div className='flex items-center gap-2 text-primary font-black text-xs bg-primary/5 px-4 py-2 rounded-xl w-fit border border-primary/10'>
                                                    <Users className='w-3 h-3' />
                                                    {job?.applications?.length}
                                                </div>
                                            </td>
                                            <td className='px-8 py-5 text-right'>
                                                <div className='flex items-center justify-end gap-3'>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigate(`/admin/jobs/${job?._id}/applicants`)}
                                                        className='text-[10px] font-black text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-primary/10 uppercase tracking-widest'
                                                    >
                                                        VIEW APPLICANTS
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => navigate(`/admin/jobs/${job?._id}/edit`)}
                                                        className='text-gray-400 hover:text-gray-900 transition-colors'
                                                    >
                                                        <Edit3 className='w-4 h-4' />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredJobs.length === 0 && (
                            <div className='py-20 text-center'>
                                <Briefcase className='w-12 h-12 text-gray-200 mx-auto mb-4' />
                                <p className='text-gray-400 font-black uppercase tracking-widest text-sm italic'>No matching career postings found</p>
                            </div>
                        )}
                    </motion.div>
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default AdminJobs
