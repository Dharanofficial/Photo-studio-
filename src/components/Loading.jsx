export default function Loading({n=6}){return <div className="grid skel">{Array.from({length:n},(_,i)=><div key={i} className="sk"/>)}</div>}
