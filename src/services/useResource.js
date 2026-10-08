import {useEffect,useState,useCallback} from 'react'
export function useResource(svc){
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('')
  const load=useCallback(()=>{setLoading(true);setError('');svc.list().then(setItems).catch(()=>setError('Something went wrong. Please try again.')).finally(()=>setLoading(false))},[svc])
  useEffect(()=>{load()},[load])
  const run=fn=>async(...a)=>{await fn(...a);setItems(await svc.list())}
  return {items,loading,error,reload:load,create:run(svc.create),update:run(svc.update),remove:run(svc.remove)}
}
