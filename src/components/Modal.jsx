import {useEffect} from 'react'
export default function Modal({title,onClose,children,wide,dark}){
  useEffect(()=>{const f=e=>e.key==='Escape'&&onClose();addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[onClose])
  return <div className={'overlay'+(dark?' dark':'')} onClick={onClose}><div className={'modal'+(wide?' wide':'')} onClick={e=>e.stopPropagation()}>
    <div className="mh"><h3>{title}</h3><button className="x" aria-label="Close" onClick={onClose}>✕</button></div>{children}</div></div>
}
