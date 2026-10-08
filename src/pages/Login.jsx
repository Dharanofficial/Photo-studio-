import {useState} from 'react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import {login,DEMO} from '../services/authService'
import {useApp} from '../context/AppContext'
import Button from '../components/Button'
export default function Login({role='customer'}){
  const {user,signIn,toast}=useApp(),nav=useNavigate(),d=DEMO[role]
  const [f,setF]=useState({email:'',password:'',remember:true}),[show,setShow]=useState(false),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
  if(user?.role===role)return <Navigate to={`/${role}/dashboard`} replace/>
  const submit=async e=>{e.preventDefault();setErr('');if(!f.email||!f.password)return setErr('Enter your email and password')
    setBusy(true);try{const r=await login(f.email,f.password,role);signIn(r.user,r.token,f.remember);nav(`/${role}/dashboard`)}catch(x){setErr(x.message)}finally{setBusy(false)}}
  return <div className={'authwrap '+role}><div className="card pad auth"><Link to="/" className="brand">PHOTO STUDIO</Link><h2>{role==='admin'?'Admin Login':'Welcome back'}</h2>
    <form className="form" onSubmit={submit} noValidate>
      <label className="field"><span>Email</span><input type="email" autoComplete="username" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label>
      <label className="field"><span>Password</span><div className="pw"><input type={show?'text':'password'} autoComplete="current-password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)}>{show?'Hide':'Show'}</button></div></label>
      <div className="row between"><label className="chk"><input type="checkbox" checked={f.remember} onChange={e=>setF({...f,remember:e.target.checked})}/> Remember me</label><a href="#" onClick={e=>{e.preventDefault();toast('Password reset becomes available once the backend is connected')}}>Forgot password?</a></div>
      {err&&<p className="err" role="alert">{err}</p>}<Button disabled={busy}>{busy?'Signing in…':'Login'}</Button></form>
    {role==='customer'&&<p className="center">New here? <a href="#" onClick={e=>{e.preventDefault();toast('Registration becomes available once the backend is connected')}}>Create account</a></p>}
    <div className="demo"><b>Demo Mode · {role==='admin'?'Admin':'Customer'} account</b><code>{d.email}<br/>{d.password}</code><Button type="button" variant="ghost" onClick={()=>{setF({...f,email:d.email,password:d.password});setErr('')}}>Use Demo Account</Button></div>
    <p className="center small">{role==='admin'?<Link to="/login">Customer login</Link>:<Link to="/admin/login">Admin login</Link>}</p></div></div>
}
