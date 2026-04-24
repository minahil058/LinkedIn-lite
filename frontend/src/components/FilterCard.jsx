import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Graphic Designer", "Data Science", "Mobile Dev"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "40k-1lakh", "1lakh-5lakh", "5lakh+"]
    },
]

const FilterCard = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const [selectedFilters, setSelectedFilters] = useState({
        location: [],
        industry: [],
        salary: ""
    });

    const handleCheckboxChange = (type, value) => {
        const key = type.toLowerCase();
        setSelectedFilters(prev => {
            const current = prev[key] || [];
            const updated = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            
            return { ...prev, [key]: updated };
        });
    }

    const handleSalaryChange = (value) => {
        setSelectedFilters(prev => ({ ...prev, salary: prev.salary === value ? "" : value }));
    }

    const clearAllFilters = () => {
        setSelectedFilters({ location: [], industry: [], salary: "" });
        dispatch(setSearchedQuery(""));
    }

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(selectedFilters);
        }
    }, [selectedFilters]);

    return (
        <div className='w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-lg text-gray-900'>Filter Jobs</h1>
                <button 
                    onClick={clearAllFilters}
                    className='text-xs text-primary font-bold hover:underline'
                >
                    Clear all
                </button>
            </div>
            <hr className='border-gray-100 mb-4' />
            
            <div className='space-y-6'>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h2 className='font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider'>{data.filterType}</h2>
                        <div className='space-y-2.5'>
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                const key = data.filterType.toLowerCase();
                                return (
                                    <div key={itemId} className='flex items-center space-x-3 group cursor-pointer'>
                                        <input
                                            type="checkbox"
                                            id={itemId}
                                            checked={
                                                key === "salary" 
                                                ? selectedFilters.salary === item
                                                : selectedFilters[key]?.includes(item)
                                            }
                                            onChange={() => {
                                                if(key === "salary") {
                                                    handleSalaryChange(item);
                                                } else {
                                                    handleCheckboxChange(data.filterType, item);
                                                }
                                            }}
                                            className='w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer'
                                        />
                                        <label 
                                            htmlFor={itemId} 
                                            className='text-sm text-gray-600 group-hover:text-black cursor-pointer transition-colors'
                                        >
                                            {item}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterCard
