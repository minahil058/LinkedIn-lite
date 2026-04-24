import React, { useEffect, useState } from 'react'
import Navbar from '../components/shared/Navbar'
import FilterCard from '../components/FilterCard'
import Job from '../components/Job'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import useGetAllJobs from '../hooks/useGetAllJobs'
import { setSearchedQuery } from '../redux/jobSlice'

const Jobs = () => {
    // FETCH JOBS ON MOUNT WITH SEARCHED QUERY
    useGetAllJobs();

    const dispatch = useDispatch();
    const { allJobs = [], searchedQuery = "" } = useSelector(store => store.job || {});
    const [filterJobs, setFilterJobs] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({
        location: [],
        industry: [],
        salary: ""
    });

    const resetFilters = () => {
        dispatch(setSearchedQuery(""));
        setSelectedFilters({
            location: [],
            industry: [],
            salary: ""
        });
    }

    useEffect(() => {
        let filtered = [...allJobs];

        // 1. Filter by Location
        if (selectedFilters.location?.length > 0) {
            filtered = filtered.filter(job =>
                selectedFilters.location.some(loc => job?.location?.toLowerCase().includes(loc.toLowerCase()))
            );
        }

        // 2. Filter by Industry/Role
        if (selectedFilters.industry?.length > 0) {
            filtered = filtered.filter(job =>
                selectedFilters.industry.some(ind => job?.title?.toLowerCase().includes(ind.toLowerCase()) || job?.description?.toLowerCase().includes(ind.toLowerCase()))
            );
        }

        // 3. Filter by Salary (Approximate match)
        if (selectedFilters.salary) {
            const salaryValue = parseInt(selectedFilters.salary);
            if (!isNaN(salaryValue)) {
                filtered = filtered.filter(job => (job?.salary || 0) >= salaryValue);
            }
        }

        // 4. Filter by Searched Query (Global Search)
        if (searchedQuery) {
            filtered = filtered.filter(job =>
                job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.location?.toLowerCase().includes(searchedQuery.toLowerCase())
            );
        }

        setFilterJobs(filtered);
    }, [allJobs, selectedFilters, searchedQuery]);

    return (
        <div className='min-h-screen bg-[#f3f2f0] flex flex-col'>
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main
                    key="jobs-page"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='max-w-7xl mx-auto mt-5 px-4 pb-10 flex-1 w-full'
                >
                    <div className='flex gap-5 flex-col md:flex-row'>
                        <div className='w-full md:w-1/4'>
                            <FilterCard onFilterChange={setSelectedFilters} />
                        </div>

                        <div className='flex-1'>
                            {
                                filterJobs.length <= 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200'
                                    >
                                        <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
                                            <svg className='w-12 h-12 text-gray-200' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <h2 className='text-xl font-bold text-gray-700 mb-2'>No matching jobs found</h2>
                                        <p className='text-gray-400 text-sm max-w-xs text-center mb-8'>
                                            We couldn't find any jobs matching your current filters. Try broadening your search.
                                        </p>
                                        <button
                                            onClick={resetFilters}
                                            className='px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all active:scale-95'
                                        >
                                            RESET ALL FILTERS
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch'>
                                        <AnimatePresence mode='popLayout'>
                                            {filterJobs.map((job) => (
                                                <motion.div
                                                    layout
                                                    key={job?._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        layout: { duration: 0.3 }
                                                    }}
                                                >
                                                    <Job job={job} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </motion.main>
            </AnimatePresence>
        </div>
    )
}

export default Jobs
