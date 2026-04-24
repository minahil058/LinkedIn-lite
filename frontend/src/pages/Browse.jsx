import React from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer.jsx'

const Browse = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#f3f2f0]">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-12 flex-1 w-full'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>Search Results (0)</h1>
                <div className='bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-premium'>
                    <div className='text-6xl mb-4'>🔍</div>
                    <h2 className='text-xl font-bold text-gray-700'>No jobs found</h2>
                    <p className='text-gray-500 mt-2'>Try searching with different keywords or filters.</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Browse
