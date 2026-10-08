import {useState} from 'react'
import Hero from '../components/Hero'
import Button from '../components/Button'
import PortfolioCard from '../components/PortfolioCard'
import ServiceCard from '../components/ServiceCard'
import PackageCard from '../components/PackageCard'
import TestimonialCard from '../components/TestimonialCard'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import {useResource} from '../services/useResource'
import {portfolioService,serviceService,packageService} from '../services/resources'
const T=[{name:'Meera & Arjun',role:'Wedding',text:'Every frame told our story. We still look through the album every week.'},{name:'Karthik S.',role:'Portrait',text:'Professional, relaxed and the results were far beyond my expectations.'},{name:'Nexa Corp',role:'Corporate event',text:'Discreet, punctual and the delivery was faster than promised.'}]
const W=[['Cinematic storytelling','We shoot moments, not poses.'],['Fast delivery','Previews in 48 hours.'],['Premium editing','Natural, timeless colour.'],['Trusted team','500+ sessions captured.']]
export default function Home(){
  const po=useResource(portfolioService),sv=useResource(serviceService),pk=useResource(packageService),[view,setView]=useState(null)
  return <><Hero/>
    <section className="section"><div className="container"><h2 className="st">Featured Photography</h2>{po.loading?<Loading/>:<div className="mason">{po.items.filter(i=>i.status==='Published').slice(0,6).map(i=><PortfolioCard key={i.id} item={i} onView={setView}/>)}</div>}<div className="center"><Button to="/portfolio" variant="ghost">View Full Portfolio</Button></div></div></section>
    <section className="section alt"><div className="container"><h2 className="st">Popular Services</h2>{sv.loading?<Loading n={3}/>:<div className="grid">{sv.items.filter(s=>s.status==='Active').slice(0,3).map(s=><ServiceCard key={s.id} s={s} onDetails={()=>{}}/>)}</div>}</div></section>
    <section className="section"><div className="container"><h2 className="st">Premium Packages</h2>{pk.loading?<Loading n={3}/>:<div className="grid">{pk.items.filter(p=>p.status==='Active').map(p=><PackageCard key={p.id} p={p}/>)}</div>}</div></section>
    <section className="section dark"><div className="container"><h2 className="st">Why Choose Us</h2><div className="grid4">{W.map(([a,b])=><div key={a}><h4>{a}</h4><p>{b}</p></div>)}</div></div></section>
    <section className="section"><div className="container"><h2 className="st">Testimonials</h2><div className="grid">{T.map(t=><TestimonialCard key={t.name} t={t}/>)}</div></div></section>
    <section className="section cta"><div className="container center"><h2>Ready to create something beautiful?</h2><Button to="/book" variant="light">Book a Session</Button></div></section>
    {view&&<Modal dark wide title={view.title} onClose={()=>setView(null)}><img className="full" src={view.image} alt={view.title}/></Modal>}</>
}
