import {useEffect,useState} from 'react'
import {NavLink,Link,useLocation} from 'react-router-dom'
import {useApp} from '../context/AppContext'
const L=[['/','Home'],['/portfolio','Portfolio'],['/services','Services'],['/packages','Packages'],['/about','About'],['/contact','Contact']]
export default function Navbar(){
  const [open,setOpen]=useState(false),[sc,setSc]=useState(false),{pathname}=useLocation(),{user}=useApp()
  useEffect(()=>{const f=()=>setSc(scrollY>40);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[])
  useEffect(()=>setOpen(false),[pathname])
  const solid=sc||pathname!=='/'||open
  return <header className={'nav '+(solid?'solid':'')}><div className="container nav-in"><Link to="/" className="brand">PHOTO STUDIO</Link>
    <button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button>
    <nav className={open?'open':''}>{L.map(([to,t])=><NavLink key={to} to={to} end={to==='/'}>{t}</NavLink>)}
      <NavLink to={user?`/${user.role}/dashboard`:'/login'}>{user?'Dashboard':'Login'}</NavLink><Link className="btn primary" to="/book">Book Now</Link></nav></div></header>
}
