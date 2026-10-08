import {useState} from 'react'
import {useResource} from '../services/useResource'
import {useApp} from '../context/AppContext'
import DataTable from './DataTable'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Loading from '../components/Loading'
const init=(fields,row)=>Object.fromEntries(fields.map(f=>[f.key,f.type==='features'?(row?.[f.key]||[]).join('\n'):row?.[f.key]??(f.type==='checkbox'?false:'')]))
export default function Manager({svc,title,noun,fields,columns,statusOptions,filterKey,filterOptions}){
  const {items,loading,error,reload,create,update,remove}=useResource(svc),{toast}=useApp()
  const [q,setQ]=useState(''),[flt,setFlt]=useState(''),[sf,setSf]=useState(''),[edit,setEdit]=useState(null),[form,setForm]=useState({}),[err,setErr]=useState({}),[del,setDel]=useState(null)
  const rows=items.filter(r=>(!q||[r.title,r.name,r.description].join(' ').toLowerCase().includes(q.toLowerCase()))&&(!flt||r[filterKey]===flt)&&(!sf||r.status===sf))
  const open=row=>{setEdit(row||{});setForm(init(fields,row));setErr({})}
  const file=e=>{const f=e.target.files[0];if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type)||f.size>1.5e6)return setErr({...err,image:'JPG/PNG/WEBP up to 1.5 MB'});const r=new FileReader();r.onload=()=>setForm(x=>({...x,image:r.result}));r.readAsDataURL(f)}
  const save=async e=>{e.preventDefault();const x={}
    fields.forEach(f=>{const v=form[f.key];if(f.required&&!String(v).trim())x[f.key]='Required';if(f.type==='number'&&v!==''&&+v<0)x[f.key]='Cannot be negative'})
    setErr(x);if(Object.keys(x).length)return
    const data={...form};fields.forEach(f=>{if(f.type==='features')data[f.key]=form[f.key].split('\n').map(s=>s.trim()).filter(Boolean);if(f.type==='number')data[f.key]=+form[f.key]})
    try{edit.id?await update(edit.id,data):await create(data);toast(`${noun} ${edit.id?'updated':'created'} successfully`);setEdit(null)}catch{toast('Something went wrong. Please try again.','err')}}
  const toggle=r=>{const [a,b]=statusOptions;update(r.id,{status:r.status===a?b:a}).then(()=>toast('Status updated successfully'))}
  const set=k=>e=>setForm({...form,[k]:e.target.type==='checkbox'?e.target.checked:e.target.value})
  return <div><div className="row between"><h2>{title}</h2><Button onClick={()=>open()}>+ Add {noun}</Button></div>
    <div className="card filters"><input className="search" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
      {filterKey&&<select value={flt} onChange={e=>setFlt(e.target.value)}><option value="">All categories</option>{filterOptions.map(o=><option key={o}>{o}</option>)}</select>}
      <select value={sf} onChange={e=>setSf(e.target.value)}><option value="">All status</option>{statusOptions.map(o=><option key={o}>{o}</option>)}</select></div>
    {loading?<Loading n={3}/>:error?<div className="card empty"><p>{error}</p><Button onClick={reload}>Retry</Button></div>:
    <DataTable rows={rows} columns={columns} actions={r=><><button onClick={()=>open(r)}>Edit</button><button onClick={()=>toggle(r)}>{r.status===statusOptions[0]?'Unpublish':'Publish'}</button><button className="d" onClick={()=>setDel(r)}>Delete</button></>}/>}
    {edit&&<Modal title={`${edit.id?'Edit':'Add'} ${noun}`} onClose={()=>setEdit(null)}><form className="form" onSubmit={save} noValidate>
      {fields.map(f=>f.type==='select'?<Select key={f.key} label={f.label} options={f.options} value={form[f.key]} onChange={set(f.key)} error={err[f.key]}/>
        :f.type==='image'?<div key={f.key} className="field"><span>{f.label}</span><input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={file}/>{form.image&&<img className="prev" src={form.image} alt=""/>}{err.image&&<small>{err.image}</small>}</div>
        :f.type==='checkbox'?<label key={f.key} className="chk"><input type="checkbox" checked={form[f.key]} onChange={set(f.key)}/> {f.label}</label>
        :<Input key={f.key} label={f.label+(f.type==='features'?' (one per line)':'')} area={f.type==='textarea'||f.type==='features'} type={f.type==='number'?'number':'text'} value={form[f.key]} onChange={set(f.key)} error={err[f.key]}/>)}
      <div className="row end"><Button type="button" variant="ghost" onClick={()=>setEdit(null)}>Cancel</Button><Button>Save</Button></div></form></Modal>}
    {del&&<Modal title="Confirm delete" onClose={()=>setDel(null)}><p>Are you sure you want to delete this item?</p><div className="row end"><Button variant="ghost" onClick={()=>setDel(null)}>Cancel</Button><Button className="danger" onClick={async()=>{await remove(del.id);setDel(null);toast(`${noun} deleted successfully`)}}>Delete</Button></div></Modal>}</div>
}
