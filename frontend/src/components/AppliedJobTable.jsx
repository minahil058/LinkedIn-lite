import React from 'react'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const { allAppliedJobs = [] } = useSelector(store => store.job);

    return (
        <div className='bg-white rounded-2xl border border-slate-100 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead className='bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]'>
                        <tr>
                            <th className='px-6 py-3'>Date</th>
                            <th className='px-6 py-3'>Job Role</th>
                            <th className='px-6 py-3'>Company</th>
                            <th className='px-6 py-3 text-right'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50'>
                        {
                            allAppliedJobs.length <= 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium text-xs">
                                        You haven't applied to any jobs yet.
                                    </td>
                                </tr>
                            ) : (
                                allAppliedJobs.map((appliedJob) => (
                                    <tr key={appliedJob?._id} className='hover:bg-slate-50 transition-all duration-300 group cursor-default'>
                                        <td className='px-6 py-5 text-[11px] text-slate-500 font-medium'>
                                            {appliedJob?.createdAt?.split("T")[0]}
                                        </td>
                                        <td className='px-6 py-5'>
                                            <span className='font-bold text-slate-900 text-xs tracking-tight'>
                                                {appliedJob?.job?.title}
                                            </span>
                                        </td>
                                        <td className='px-6 py-5'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm'>
                                                    {appliedJob?.job?.company?.logo ? (
                                                        <img src={appliedJob?.job?.company?.logo} alt="logo" className='w-full h-full object-contain' />
                                                    ) : (
                                                        <span className='text-[10px] font-black text-slate-300'>C</span>
                                                    )}
                                                </div>
                                                <span className='text-slate-600 font-bold text-xs'>{appliedJob?.job?.company?.name}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-5 text-right'>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                appliedJob?.status?.toLowerCase() === "rejected" ? "bg-red-50 text-red-600 border border-red-100" : 
                                                appliedJob?.status?.toLowerCase() === "pending" ? "bg-slate-50 text-slate-500 border border-slate-100" : 
                                                "bg-green-50 text-green-600 border border-green-100"
                                            }`}>
                                                {appliedJob?.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AppliedJobTable
