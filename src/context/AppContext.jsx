import {createContext,useContext,useState} from 'react'
import {store} from '../services/api'
const C=createContext()
export function AppProvider({children}){
  const [user,setUser]=useState(()=>store.get('auth')),[toasts,setToasts]=useState([])
  const toast=(msg,type='ok')=>{const id=Math.random();setToasts(t=>[...t,{id,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000)}
  const signIn=(u,token,remember)=>{if(remember){store.set('auth',u);store.set('token',token)}setUser(u)}
  const signOut=()=>{store.del('auth');store.del('token');setUser(null)}
  const saveUser=u=>{if(store.get('auth'))store.set('auth',u);setUser(u)}
  return <C.Provider value={{user,toast,signIn,signOut,saveUser}}>{children}<div className="toasts">{toasts.map(t=><div key={t.id} className={'toast '+t.type}>{t.msg}</div>)}</div></C.Provider>
}
export const useApp=()=>useContext(C)
