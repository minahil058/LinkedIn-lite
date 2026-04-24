import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '../redux/jobSlice';
import { useNavigate } from 'react-router-dom';

import AnimatedCounter from './AnimatedCounter';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    }

    return (
        <div className='text-center bg-white border-b border-gray-200 py-20 px-4'>
            <div className='max-w-4xl mx-auto flex flex-col gap-10'>
                <div className='flex flex-col gap-5'>
                    <h1 className='text-4xl md:text-5xl font-light text-[#8f5849] leading-tight'>
                        Welcome to your <br />
                        <span className='text-primary font-bold'>professional community</span>
                    </h1>
                    <p className='text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto'>
                        Explore over 1,000,000+ jobs and connect with professionals around the world.
                    </p>
                </div>

                <div className='relative w-full max-w-2xl mx-auto'>
                    <div className='flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all'>
                        <div className='flex items-center gap-2 flex-1 px-3'>
                            <span className='text-gray-400 font-bold text-xs mr-1'>[SEARCH]</span>
                            <input
                                type="text"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='Search for jobs, skills, or companies'
                                className='w-full py-3 text-sm outline-none bg-transparent'
                            />
                        </div>
                        <button
                            onClick={searchJobHandler}
                            className='bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-hover transition-all'
                        >
                            Search
                        </button>
                    </div>
                    <div className='mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500'>
                        <span className='font-bold text-gray-400 uppercase tracking-wider text-[10px]'>Popular searches:</span>
                        <button onClick={() => { setQuery("Software Engineer"); searchJobHandler(); }} className='hover:text-primary hover:underline transition-all'>Software Engineer</button>
                        <button onClick={() => { setQuery("Product Manager"); searchJobHandler(); }} className='hover:text-primary hover:underline transition-all'>Product Manager</button>
                        <button onClick={() => { setQuery("UX Designer"); searchJobHandler(); }} className='hover:text-primary hover:underline transition-all'>UX Designer</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-gray-800">
                            <AnimatedCounter value="2" suffix="M+" />
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Active Jobs</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-gray-800">
                            <AnimatedCounter value="1" suffix="M+" />
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Companies</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-gray-800">
                            <AnimatedCounter value="500" suffix="k+" />
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Recruiters</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-2xl font-bold text-gray-800">
                            <AnimatedCounter value="24/7" />
                        </span>
                        <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Expert Support</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
