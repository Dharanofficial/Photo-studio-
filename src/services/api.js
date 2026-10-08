import {seed} from '../data/seed'
// Set VITE_API_URL to use a real REST backend; otherwise a localStorage mock is used.
const BASE=import.meta.env.VITE_API_URL||''
export const isMock=!BASE
export const store={get:k=>{try{return JSON.parse(localStorage.getItem('ps_'+k))}catch{return null}},set:(k,v)=>localStorage.setItem('ps_'+k,JSON.stringify(v)),del:k=>localStorage.removeItem('ps_'+k)}
const wait=v=>new Promise(r=>setTimeout(()=>r(v),350))
export async function http(method,path,body){
  const t=store.get('token')
  const res=await fetch(BASE+path,{method,headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:body?JSON.stringify(body):undefined})
  if(!res.ok)throw new Error((await res.json().catch(()=>({}))).message||'Something went wrong. Please try again.')
  return res.json()
}
export function collection(name){
  if(!isMock)return{list:()=>http('GET','/api/'+name),create:d=>http('POST','/api/'+name,d),update:(id,d)=>http('PUT',`/api/${name}/${id}`,d),remove:id=>http('DELETE',`/api/${name}/${id}`)}
  const all=()=>{let d=store.get(name);if(!d){d=seed[name];store.set(name,d)}return d}
  return{list:()=>wait(all()),
    create:d=>{const r={id:Date.now().toString(36),createdAt:new Date().toISOString(),...d};store.set(name,[r,...all()]);return wait(r)},
    update:(id,d)=>{store.set(name,all().map(x=>x.id===id?{...x,...d}:x));return wait(d)},
    remove:id=>{store.set(name,all().filter(x=>x.id!==id));return wait(true)}}
}
