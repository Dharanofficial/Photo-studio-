import {useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import Input from './Input'
import Select from './Select'
import Button from './Button'
import {useResource} from '../services/useResource'
import {packageService,bookingService} from '../services/resources'
import {useApp} from '../context/AppContext'
export const TYPES=['Wedding','Pre-Wedding','Portrait','Event','Fashion','Product','Birthday']
export default function BookingForm({onDone}){
  const [sp]=useSearchParams(),{user,toast}=useApp(),{items:pk}=useResource(packageService)
  const [f,setF]=useState({name:user?.name||'',email:user?.email||'',phone:'',type:sp.get('type')||'',package:sp.get('package')||'',date:'',time:'',location:'',guests:'',notes:''})
  const [e,setE]=useState({}),[busy,setBusy]=useState(false)
  const set=k=>v=>setF({...f,[k]:v.target.value})
  const submit=async ev=>{ev.preventDefault();const x={},today=new Date().toISOString().slice(0,10)
    if(f.name.trim().length<2)x.name='Enter your full name'
    if(!/^\S+@\S+\.\S+$/.test(f.email))x.email='Enter a valid email'
    if(!/^\d{10}$/.test(f.phone.replace(/\D/g,'').slice(-10))||f.phone.replace(/\D/g,'').length<10)x.phone='Enter a 10-digit phone number'
    if(!f.type)x.type='Select an event type';if(!f.package)x.package='Select a package'
    if(!f.date)x.date='Select a date';else if(f.date<today)x.date='Date cannot be in the past'
    if(!f.time)x.time='Select a time';if(!f.location.trim())x.location='Enter the location'
    if(f.guests!==''&&+f.guests<0)x.guests='Cannot be negative'
    setE(x);if(Object.keys(x).length)return
    setBusy(true)
    try{const ref='PS-'+Math.random().toString(36).slice(2,8).toUpperCase();await bookingService.create({...f,ref,status:'Pending'});toast('Booking created successfully');onDone({...f,ref,status:'Pending'})}
    catch{toast('Something went wrong. Please try again.','err')}finally{setBusy(false)}}
  return <form className="card pad form" onSubmit={submit} noValidate><div className="grid2">
    <Input label="Full Name" value={f.name} onChange={set('name')} error={e.name}/><Input label="Email" type="email" value={f.email} onChange={set('email')} error={e.email}/>
    <Input label="Phone Number" type="tel" value={f.phone} onChange={set('phone')} error={e.phone}/><Select label="Event Type" options={TYPES} value={f.type} onChange={set('type')} error={e.type}/>
    <Select label="Package" options={pk.filter(p=>p.status==='Active').map(p=>p.name)} value={f.package} onChange={set('package')} error={e.package}/><Input label="Event Date" type="date" value={f.date} onChange={set('date')} error={e.date}/>
    <Input label="Event Time" type="time" value={f.time} onChange={set('time')} error={e.time}/><Input label="Event Location" value={f.location} onChange={set('location')} error={e.location}/>
    <Input label="Number of Guests" type="number" min="0" value={f.guests} onChange={set('guests')} error={e.guests}/></div>
    <Input area label="Additional Requirements" value={f.notes} onChange={set('notes')}/><Button disabled={busy}>{busy?'Submitting…':'Submit Booking'}</Button></form>
}
