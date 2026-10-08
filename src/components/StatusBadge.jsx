export default function StatusBadge({status}){return <span className={'badge '+String(status).replace(/\s/g,'')}>{status}</span>}
