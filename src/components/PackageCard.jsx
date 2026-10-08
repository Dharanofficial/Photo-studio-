import Button from './Button'
export default function PackageCard({p,onDetails}){
  return <article className={'card pkg'+(p.popular?' hot':'')}>{p.popular&&<span className="ribbon">MOST POPULAR</span>}
    <h3>{p.name.toUpperCase()}</h3><div className="amt">₹{Number(p.price).toLocaleString('en-IN')}</div>
    <ul className="ticks">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
    <div className="row"><Button variant="ghost" onClick={()=>onDetails&&onDetails(p)}>View Details</Button><Button to={'/book?package='+p.name}>Book Package</Button></div></article>
}
