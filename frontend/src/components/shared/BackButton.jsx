import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <motion.button 
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-primary bg-white border border-gray-100 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-all'
        >
            <ArrowLeft className='w-3.5 h-3.5' strokeWidth={1.5} />
            BACK
        </motion.button>
    )
}

export default BackButton
