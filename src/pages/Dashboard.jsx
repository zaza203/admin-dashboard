import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'


const Dashboard = () => {
  return (
    <div className='d-flex vh-100'>
        <Sidebar />
        <div className='d-flex flex-column flex-grow-1'>
            <Navbar />
            <div className='py-3 h-100'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Dashboard