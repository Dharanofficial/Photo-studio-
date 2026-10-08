import {Link} from 'react-router-dom'
export default function Button({to,variant='primary',className='',children,...p}){
  const c=`btn ${variant} ${className}`
  return to?<Link to={to} className={c} {...p}>{children}</Link>:<button className={c} {...p}>{children}</button>
}
