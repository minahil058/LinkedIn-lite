import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import useGetCompanyById from '../../hooks/useGetCompanyById'
import { Building2, Save, Loader2, Globe, MapPin, UploadCloud } from 'lucide-react'
import BackButton from '../../components/shared/BackButton'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const { singleCompany } = useSelector(store => store.company);
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    // IMMEDIATE AUTH CHECK
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Setup update failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null
            })
        }
    }, [singleCompany]);

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main 
                    key="company-setup-page"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className='max-w-xl mx-auto px-4 py-12 flex-1 w-full'
                >
                    <div className='mb-10 flex items-center gap-6'>
                        <BackButton />
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <Building2 className='w-5 h-5 text-primary' />
                                <h1 className='text-3xl font-black text-gray-900 uppercase tracking-tight'>Brand Setup</h1>
                            </div>
                            <p className='text-gray-500 font-bold'>Complete your corporate profile to attract top-tier talent.</p>
                        </div>
                    </div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className='bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-premium'
                    >
                        <form onSubmit={submitHandler} className='space-y-8'>
                            <div className='grid grid-cols-1 gap-6'>
                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Official Brand Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        onChange={changeEventHandler}
                                        className='input-field'
                                        required
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Global Website</label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            name="website"
                                            value={input.website}
                                            onChange={changeEventHandler}
                                            className='input-field pl-12'
                                            placeholder="https://acme.co"
                                        />
                                        <Globe className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300' />
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Corporate Mission (Description)</label>
                                <textarea
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    rows="3"
                                    className='input-field resize-none'
                                    placeholder="Define your company culture and vision..."
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Headquarters Location</label>
                                <div className='relative'>
                                    <input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className='input-field pl-12'
                                        placeholder="City, Country"
                                    />
                                    <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300' />
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2'>Visual Identity (Logo)</label>
                                <div className='flex items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100'>
                                    <div className='w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm'>
                                        {input.file ? (
                                            <img 
                                                src={typeof input.file === 'string' ? input.file : URL.createObjectURL(input.file)} 
                                                alt="preview" 
                                                className='w-full h-full object-cover' 
                                            />
                                        ) : (
                                            <UploadCloud className='w-6 h-6 text-gray-200' />
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={changeFileHandler}
                                            className='text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all'
                                        />
                                        <p className='text-[10px] text-gray-400 mt-2 font-bold'>PNG, JPG up to 2MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className='pt-6'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className='w-full bg-primary text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 transition-all disabled:opacity-50'
                                >
                                    {loading ? (
                                        <Loader2 className='w-5 h-5 animate-spin' />
                                    ) : (
                                        <>
                                            <Save className='w-5 h-5' />
                                            Save Corporate Identity
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

export default CompanySetup
