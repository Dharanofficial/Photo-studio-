import {useState} from 'react'
import {NavLink,Outlet,useNavigate,Link} from 'react-router-dom'
import {useApp} from '../context/AppContext'
export default function DashLayout({links,title}){
  const {user,signOut}=useApp(),nav=useNavigate(),[open,setOpen]=useState(false)
  const out=()=>{signOut();nav(user.role==='admin'?'/admin/login':'/login')}
  return <div className="dash"><aside className={'dside '+(open?'open':'')}><Link to="/" className="brand">PHOTO STUDIO</Link><small>{title}</small>
    <nav>{links.map(([to,t])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{t}</NavLink>)}<button onClick={out}>Logout</button></nav></aside>
    <div className="dmain"><header className="dhead"><button className="burger show" onClick={()=>setOpen(!open)}>☰</button><b>{title}</b><span>{user.name}</span></header><div className="dcontent"><Outlet/></div></div></div>
}
