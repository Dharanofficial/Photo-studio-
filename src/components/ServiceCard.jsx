import Button from './Button'
export default function ServiceCard({s,onDetails}){
  return <article className="card scard"><img src={s.image} alt={s.name}/><div className="pad"><h3>{s.name}</h3><p>{s.description}</p>
    <p className="price">Starting from ₹{Number(s.price).toLocaleString('en-IN')}</p><ul className="ticks">{s.features.slice(0,3).map(f=><li key={f}>{f}</li>)}</ul>
    <div className="row"><Button variant="ghost" onClick={()=>onDetails(s)}>View Details</Button><Button to={'/book?type='+encodeURIComponent(s.name.split(' ')[0])}>Book Now</Button></div></div></article>
}
