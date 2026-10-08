import {Routes,Route,Navigate,Outlet} from 'react-router-dom'
import {useApp} from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DashLayout from './admin/DashLayout'
import Home from './pages/Home'
import {Portfolio,Services,Packages,About,Contact} from './pages/Public'
import Book from './pages/Book'
import Login from './pages/Login'
import * as D from './pages/Dashboards'
const Public=()=><><Navbar/><main><Outlet/></main><Footer/></>
const Guard=({role,children})=>{const {user}=useApp();return user?.role===role?children:<Navigate to={role==='admin'?'/admin/login':'/login'} replace/>}
const CL=[['/customer/dashboard','Dashboard'],['/customer/bookings','My Bookings'],['/customer/inquiries','Inquiries'],['/customer/profile','Profile'],['/customer/settings','Settings']]
const AL=[['/admin/dashboard','Dashboard'],['/admin/portfolio','Portfolio'],['/admin/services','Services'],['/admin/packages','Packages'],['/admin/customers','Customers'],['/admin/inquiries','Inquiries'],['/admin/bookings','Bookings'],['/admin/settings','Settings']]
export default function App(){
  return <Routes>
    <Route element={<Public/>}><Route index element={<Home/>}/><Route path="portfolio" element={<Portfolio/>}/><Route path="services" element={<Services/>}/><Route path="packages" element={<Packages/>}/><Route path="about" element={<About/>}/><Route path="contact" element={<Contact/>}/><Route path="book" element={<Book/>}/><Route path="login" element={<Login/>}/></Route>
    <Route path="/admin/login" element={<Login role="admin"/>}/>
    <Route path="/customer" element={<Guard role="customer"><DashLayout links={CL} title="My Account"/></Guard>}><Route index element={<Navigate to="dashboard" replace/>}/>
      <Route path="dashboard" element={<D.CustDashboard/>}/><Route path="bookings" element={<D.CustBookings/>}/><Route path="inquiries" element={<D.CustInquiries/>}/><Route path="profile" element={<D.CustProfile/>}/><Route path="settings" element={<D.Prefs/>}/></Route>
    <Route path="/admin" element={<Guard role="admin"><DashLayout links={AL} title="Admin"/></Guard>}><Route index element={<Navigate to="dashboard" replace/>}/>
      <Route path="dashboard" element={<D.AdminDashboard/>}/><Route path="portfolio" element={<D.AdminPortfolio/>}/><Route path="services" element={<D.AdminServices/>}/><Route path="packages" element={<D.AdminPackages/>}/><Route path="customers" element={<D.AdminCustomers/>}/><Route path="inquiries" element={<D.AdminInquiries/>}/><Route path="bookings" element={<D.AdminBookings/>}/><Route path="settings" element={<D.AdminSettings/>}/></Route>
    <Route path="*" element={<Navigate to="/" replace/>}/></Routes>
}
