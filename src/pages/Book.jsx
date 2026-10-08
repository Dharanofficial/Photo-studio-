import {useState} from 'react'
import BookingForm from '../components/BookingForm'
import Button from '../components/Button'
export default function Book(){
  const [done,setDone]=useState(null)
  return <><div className="phead"><div className="container"><h1>Book a Session</h1><p>Share your details and we will confirm within 24 hours.</p></div></div>
    <section className="section"><div className="container narrow">{done?<div className="card pad success"><div className="tick">✓</div><h2>Booking Request Submitted</h2>
      <table className="kv"><tbody><tr><th>Booking Reference</th><td>{done.ref}</td></tr><tr><th>Customer Name</th><td>{done.name}</td></tr><tr><th>Package</th><td>{done.package}</td></tr><tr><th>Event Date</th><td>{done.date}</td></tr><tr><th>Status</th><td><span className="badge Pending">Pending</span></td></tr></tbody></table>
      <div className="row"><Button to="/">Back to Home</Button><Button variant="ghost" onClick={()=>setDone(null)}>New Booking</Button></div></div>:<BookingForm onDone={setDone}/>}</div></section></>
}
