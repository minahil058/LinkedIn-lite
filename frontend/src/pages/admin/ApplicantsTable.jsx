import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, X, Clock, User } from 'lucide-react'

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application || {});
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

    const [updatingId, setUpdatingId] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            setUpdatingId(id);
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("STATUS_UPDATE_CRITICAL_FAILURE:", {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            const errorMessage = error.response?.data?.message || "Internal server error. Check console for details.";
            toast.error(errorMessage);
        } finally {
            setUpdatingId(null);
        }
    }

    const handleDownload = async (url, fileName) => {
        if (!url) return toast.error("Resume link is invalid.");
        
        try {
            const secureUrl = url.replace("http://", "https://");
            const response = await fetch(secureUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${fileName}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            toast.success("Downloading resume...");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download. Opening in new tab instead.");
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    return (
        <div className='overflow-x-auto relative'>
            <table className='w-full text-left border-collapse'>
                <thead>
                    <tr className='border-b border-gray-100'>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>Full Name</th>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>Email</th>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>Experience</th>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>Resume</th>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest'>Cover Letter</th>
                        <th className='py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id} className='border-b border-gray-50 hover:bg-gray-50/50 transition-all group'>
                                <td className='py-5 px-4'>
                                    <p className='font-bold text-gray-800'>{item?.applicant?.name}</p>
                                    <p className='text-[10px] text-gray-400 font-bold uppercase'>{item?.createdAt?.split("T")[0]}</p>
                                </td>
                                <td className='py-5 px-4 text-gray-600 font-medium'>{item?.applicant?.email}</td>
                                <td className='py-5 px-4'>
                                    <div className='flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg w-fit'>
                                        <Clock className='w-3 h-3' />
                                        {item?.experience || "N/A"}
                                    </div>
                                </td>
                                <td className='py-5 px-4'>
                                    {
                                        item.applicant?.profile?.resume ? (
                                            <button 
                                                onClick={() => handleDownload(item?.applicant?.profile?.resume, item?.applicant?.name)}
                                                className="text-primary font-bold hover:underline text-xs flex items-center gap-1 uppercase tracking-widest"
                                            >
                                                <FileText className='w-3 h-3' />
                                                RESUME
                                            </button>
                                        ) : <span className='text-gray-400 italic text-xs'>No resume</span>
                                    }
                                </td>
                                <td className='py-5 px-4'>
                                    <button 
                                        onClick={() => setSelectedCoverLetter({ text: item?.coverLetter, name: item?.applicant?.name })}
                                        className='text-[10px] font-black text-primary hover:text-white hover:bg-primary border border-primary px-3 py-1 rounded-full transition-all uppercase tracking-widest'
                                    >
                                        View Letter
                                    </button>
                                </td>
                                <td className='py-5 px-4 text-right'>
                                    <select 
                                        disabled={updatingId === item?._id}
                                        onChange={(e) => statusHandler(e.target.value, item?._id)}
                                        className={`bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-black text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer uppercase ${updatingId === item?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        defaultValue={item?.status}
                                    >
                                        <option value="pending" disabled>Status</option>
                                        {
                                            shortlistingStatus.map((status, index) => (
                                                <option key={index} value={status.toLowerCase()}>{status}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* PROFESSIONAL COMPACT INSIGHTS MODAL */}
            <AnimatePresence>
                {selectedCoverLetter && (
                    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg'>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className='bg-white w-full max-w-md mx-4 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 relative'
                        >
                            <div className='p-6 md:p-8'>
                                <div className='flex items-center justify-between mb-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white'>
                                            <FileText className='w-4 h-4' />
                                        </div>
                                        <div>
                                            <h2 className='text-lg font-black text-slate-900 uppercase tracking-tighter'>Insights</h2>
                                            <div className='flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[7px] font-black uppercase tracking-widest border border-blue-100'>
                                                <User className='w-2 h-2' />
                                                {selectedCoverLetter.name}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedCoverLetter(null)} 
                                        className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'
                                    >
                                        <X className='w-4 h-4 text-gray-400' />
                                    </button>
                                </div>
                                
                                <div className='bg-slate-50 rounded-2xl p-6 border border-slate-100'>
                                    {selectedCoverLetter.text ? (
                                        <div className='max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar'>
                                            <p className='text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-[13px] font-sans'>
                                                {selectedCoverLetter.text}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='py-10 text-center'>
                                            <div className='w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100'>
                                                <FileText className='w-6 h-6 text-white' />
                                            </div>
                                            <h3 className='text-slate-900 font-bold text-sm uppercase tracking-wider mb-1'>Not Submitted</h3>
                                            <p className='text-slate-400 text-[10px] font-medium'>No cover letter provided.</p>
                                        </div>
                                    )}
                                </div>

                                <div className='mt-6 flex justify-center'>
                                    <button 
                                        onClick={() => setSelectedCoverLetter(null)}
                                        className='w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95'
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {
                (!applicants || applicants?.applications?.length === 0) && (
                    <div className='py-20 text-center text-gray-400 font-black tracking-widest text-sm'>
                        NO APPLICANTS YET
                    </div>
                )
            }
        </div>
    )
}

export default ApplicantsTable
