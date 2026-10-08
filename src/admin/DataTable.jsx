import EmptyState from '../components/EmptyState'
export default function DataTable({columns,rows,actions,empty='No records found'}){
  if(!rows.length)return <EmptyState title={empty}/>
  return <div className="card tw"><table className="tbl"><thead><tr>{columns.map(c=><th key={c.label}>{c.label}</th>)}{actions&&<th>Actions</th>}</tr></thead>
    <tbody>{rows.map(r=><tr key={r.id}>{columns.map(c=><td key={c.label} data-l={c.label}>{c.render?c.render(r):r[c.key]}</td>)}{actions&&<td data-l="Actions" className="acts">{actions(r)}</td>}</tr>)}</tbody></table></div>
}
