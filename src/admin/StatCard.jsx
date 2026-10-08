export default function StatCard({label,value,hint}){return <div className="card stat"><small>{label}</small><b>{value}</b>{hint&&<em>{hint}</em>}</div>}
