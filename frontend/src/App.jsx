import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Browse from './pages/Browse'
import AdminJobs from './pages/admin/AdminJobs'
import PostJob from './pages/admin/PostJob'
import CompanyCreate from './pages/admin/CompanyCreate'
import CompanySetup from './pages/admin/CompanySetup'
import CompanyProfile from './pages/admin/CompanyProfile'
import Companies from './pages/admin/Companies'
import Applicants from './pages/admin/Applicants'
import EditJob from './pages/admin/EditJob'
import Profile from './pages/Profile'
import JobDescription from './pages/JobDescription'
import SavedJobs from './pages/SavedJobs'
import Forbidden from './pages/Forbidden'
import ProtectedRoute from './components/auth/ProtectedRoute'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/saved-jobs",
    element: <ProtectedRoute><SavedJobs /></ProtectedRoute>
  },
  {
    path: "/forbidden",
    element: <Forbidden />
  },
  // admin routes
  {
    path: "/admin/companies",
    element: <ProtectedRoute adminOnly={true}><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute adminOnly={true}><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute adminOnly={true}><CompanyProfile /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id/setup",
    element: <ProtectedRoute adminOnly={true}><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute adminOnly={true}><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute adminOnly={true}><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute adminOnly={true}><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/edit",
    element: <ProtectedRoute adminOnly={true}><EditJob /></ProtectedRoute>
  },
])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
