import React, { useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../../utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '../../redux/applicationSlice'
import { motion, AnimatePresence } from 'framer-motion'
import BackButton from '../../components/shared/BackButton'
import { Users, Sparkles } from 'lucide-react'

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application || { applicants: [] });
    const { user } = useSelector(store => store.auth);

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (user) fetchAllApplicants();
    }, [params.id, dispatch, user]);

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="applicants-page"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='max-w-7xl mx-auto px-4 py-12 flex-1 w-full'
                >
                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-premium'
                    >
                        <div className='mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
                            <div className='flex items-center gap-6'>
                                <BackButton />
                                <div>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <Users className='w-6 h-6 text-primary' />
                                        <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>
                                            Talent Pipeline ({applicants?.applications?.length || 0})
                                        </h1>
                                        <Sparkles className='w-4 h-4 text-amber-400' />
                                    </div>
                                    <p className='text-gray-500 font-bold'>Review and evaluate elite candidates for your job posting.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='mt-4'>
                            <ApplicantsTable />
                        </div>
                    </motion.div>
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    )
}

export default Applicants
