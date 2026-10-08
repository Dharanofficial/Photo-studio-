export default function Input({label,error,type='text',area,...p}){
  return <label className={'field'+(error?' bad':'')}><span>{label}</span>{area?<textarea rows="4" {...p}/>:<input type={type} {...p}/>}{error&&<small>{error}</small>}</label>
}
