import {Link} from 'react-router-dom'
export default function Footer(){
  return <footer className="footer"><div className="container fgrid"><div><b className="brand">PHOTO STUDIO</b><p>Professional photography for weddings, portraits, events and more.</p></div>
    <div><h4>Explore</h4><Link to="/portfolio">Portfolio</Link><Link to="/services">Services</Link><Link to="/packages">Packages</Link></div>
    <div><h4>Company</h4><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/admin/login">Admin</Link></div>
    <div><h4>Contact</h4><p>hello@photostudio.demo<br/>+91 98765 43210</p></div></div><div className="copy">© 2026 PHOTO STUDIO. Demo project.</div></footer>
}
