import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import '../../styles/Layout.css'

const Layout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
