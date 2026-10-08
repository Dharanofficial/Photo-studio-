import DataTable from './DataTable'
import StatusBadge from '../components/StatusBadge'
export default function InquiryTable({rows,actions}){
  return <DataTable empty="No inquiries found" rows={rows} actions={actions} columns={[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},{key:'subject',label:'Subject'},{label:'Date',render:r=>new Date(r.createdAt).toLocaleDateString()},{label:'Status',render:r=><StatusBadge status={r.status}/>}]}/>
}
