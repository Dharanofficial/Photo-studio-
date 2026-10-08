export default function PortfolioCard({item,onView}){
  return <figure className="pcard" onClick={()=>onView(item)}><img src={item.image} alt={item.title} loading="lazy"/><figcaption><small>{item.category}</small><h4>{item.title}</h4><span>View</span></figcaption></figure>
}
