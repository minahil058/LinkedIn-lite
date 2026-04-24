import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice'
import { setSearchedQuery } from '../../redux/jobSlice'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant'
import { UserCircle2, Search, X } from 'lucide-react'

const Navbar = () => {
  const { user = null } = useSelector(store => store?.auth || {});
  const { searchedQuery } = useSelector(store => store?.job || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchedQuery || "");

  const searchHandler = () => {
    if (localSearch.trim() && window.location.pathname !== '/jobs') {
        dispatch(setSearchedQuery(localSearch));
        navigate('/jobs');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        searchHandler();
    }
  }

  // Debounce logic for real-time filtering ONLY if on /jobs page
  useEffect(() => {
    if (window.location.pathname === '/jobs') {
        const handler = setTimeout(() => {
            dispatch(setSearchedQuery(localSearch));
        }, 300);
        return () => clearTimeout(handler);
    }
  }, [localSearch, dispatch]);

  // Sync local search with Redux (if changed elsewhere)
  useEffect(() => {
    setLocalSearch(searchedQuery);
  }, [searchedQuery]);

  const clearSearch = () => {
    setLocalSearch("");
    dispatch(setSearchedQuery(""));
  }

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  return (
    <nav className="glass-header shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2 flex-1">
          <Link to="/" className="text-primary font-bold text-2xl flex items-center group">
            <span className="bg-primary text-white px-2 py-0.5 rounded-sm leading-tight">in</span>
          </Link>
          <div className="relative max-w-xs w-full hidden md:block ml-2">
            <button 
                onClick={searchHandler}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors'
            >
                <Search className='w-4 h-4' />
            </button>
            <input
              type="text"
              placeholder="Search jobs..."
              value={localSearch}
              onKeyDown={handleKeyDown}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#edf3f8] border-none rounded-md text-sm focus:bg-white outline-none transition-all"
            />
            {localSearch && (
                <button 
                    onClick={clearSearch}
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-all'
                >
                    <X className='w-3 h-3' />
                </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 text-gray-500 font-bold text-[10px] uppercase tracking-tighter">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            {
              user && (
                user.role === 'recruiter' ? (
                  <>
                    <Link to="/admin/companies" className="hover:text-black transition-colors">Companies</Link>
                    <Link to="/admin/jobs" className="hover:text-black transition-colors">Jobs</Link>
                  </>
                ) : (
                  <Link to="/jobs" className="hover:text-black transition-colors">Jobs</Link>
                )
              )
            }
          </div>

          {!user ? (
            <div className='flex items-center gap-2 border-l border-gray-200 pl-4'>
              <Link to="/login" className='text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-all'>Sign in</Link>
              <Link to="/signup" className='text-sm font-semibold text-primary border border-primary px-5 py-2 rounded-full hover:bg-blue-50 transition-all'>Join now</Link>
            </div>
          ) : (
            <div className="relative border-l border-gray-200 pl-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col items-center cursor-pointer group outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100 text-[10px] font-bold text-gray-600">
                  {
                    user?.profile?.profilePhoto ? (
                      <img
                        src={user?.profile?.profilePhoto}
                        alt="avatar"
                        className='w-full h-full object-cover'
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="text-primary scale-125"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M6.16 18.26a6.2 6.2 0 0 1 11.68 0"/></svg></div>'; }}
                      />
                    ) : (
                      <div className='text-primary scale-125'>
                        <UserCircle2 className='w-4 h-4' />
                      </div>
                    )
                  }
                </div>
                <div className='flex items-center gap-0.5'>
                  <span className="text-[11px] text-gray-500 font-medium group-hover:text-black">Account ▼</span>
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-xl py-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className='px-4 py-3 border-b border-gray-100 bg-gray-50/50'>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden text-left">
                        <p className='font-bold text-sm text-gray-900 truncate'>{user?.name}</p>
                        <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 mt-3'>
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-center text-primary text-xs font-bold border border-primary rounded-full py-1 hover:bg-blue-50 transition-all">
                        View Profile
                        </Link>
                        <Link to="/saved-jobs" onClick={() => setIsMenuOpen(false)} className="block text-center text-gray-600 text-xs font-bold border border-gray-200 rounded-full py-1 hover:bg-gray-50 transition-all">
                        Saved Jobs
                        </Link>
                    </div>
                  </div>
                  <div className='py-1'>
                    <button
                      onClick={logoutHandler}
                      className='w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 font-bold flex items-center gap-2'
                    >
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
