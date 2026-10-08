export default function EmptyState({title='Nothing found',text,children}){return <div className="empty"><div>📷</div><h3>{title}</h3>{text&&<p>{text}</p>}{children}</div>}
