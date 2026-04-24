import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='bg-white border-t border-slate-100 py-12 mt-auto'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-10'>
                    <div className='col-span-2 md:col-span-1'>
                        <Link to="/" className="text-primary font-bold text-lg flex items-center gap-1">
                            <span className="bg-primary text-white px-1 py-0.5 rounded-sm text-sm">in</span>
                            <span className="text-slate-900">JobPortal</span>
                        </Link>
                        <p className='text-slate-400 text-[11px] mt-4 leading-relaxed max-w-xs'>
                            Building the next generation of professional networking and opportunity.
                        </p>
                    </div>

                    <div>
                        <h4 className='font-semibold text-slate-900 mb-4 text-[10px] uppercase tracking-widest'>General</h4>
                        <ul className='space-y-2 text-[11px] text-slate-500'>
                            <li><Link to="/signup" className='hover:text-primary transition-colors'>Sign Up</Link></li>
                            <li><Link to="/help" className='hover:text-primary transition-colors'>Help Center</Link></li>
                            <li><Link to="/about" className='hover:text-primary transition-colors'>About</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='font-semibold text-slate-900 mb-4 text-[10px] uppercase tracking-widest'>Business</h4>
                        <ul className='space-y-2 text-[11px] text-slate-500'>
                            <li><Link to="/admin/jobs/create" className='hover:text-primary transition-colors'>Post a Job</Link></li>
                            <li><Link to="/talent" className='hover:text-primary transition-colors'>Talent Solutions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='font-semibold text-slate-900 mb-4 text-[10px] uppercase tracking-widest'>Follow</h4>
                        <div className='flex items-center gap-4 text-slate-400 font-medium text-[10px]'>
                            <a href="#" className='hover:text-primary transition-colors'>LinkedIn</a>
                            <a href="#" className='hover:text-primary transition-colors'>Twitter</a>
                        </div>
                    </div>
                </div>

                <div className='border-t border-slate-50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
                    <p className='text-[10px] text-slate-400'>© 2026 JobPortal. Built for the future.</p>
                    <div className='flex gap-6 text-[10px] text-slate-400 font-medium'>
                        <Link to="/privacy" className='hover:text-primary transition-colors'>Privacy</Link>
                        <Link to="/terms" className='hover:text-primary transition-colors'>Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
