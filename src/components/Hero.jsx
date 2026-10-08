import Button from './Button'
import {ph} from '../data/seed'
export default function Hero(){
  return <section className="hero"><div className="container hero-in"><div><h1>Capture Your Moments.<br/>Preserve Your Memories.</h1>
    <p>Professional photography services for weddings, portraits, events, and unforgettable moments.</p>
    <div className="row"><Button to="/portfolio">Explore Portfolio</Button><Button to="/book" variant="light">Book a Session</Button></div></div>
    <div className="hero-img"><img src={ph(1)} alt=""/><img src={ph(4)} alt=""/><img src={ph(0)} alt=""/></div></div></section>
}
