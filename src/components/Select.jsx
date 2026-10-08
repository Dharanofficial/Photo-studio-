export default function Select({label,error,options,placeholder='Select…',...p}){
  return <label className={'field'+(error?' bad':'')}><span>{label}</span><select {...p}><option value="">{placeholder}</option>{options.map(o=><option key={o}>{o}</option>)}</select>{error&&<small>{error}</small>}</label>
}
