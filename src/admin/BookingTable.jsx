import DataTable from './DataTable'
import StatusBadge from '../components/StatusBadge'
export default function BookingTable({rows,actions}){
  return <DataTable empty="No bookings found" rows={rows} actions={actions} columns={[{key:'ref',label:'Booking'},{key:'name',label:'Customer'},{key:'package',label:'Package'},{key:'date',label:'Date'},{label:'Status',render:r=><StatusBadge status={r.status}/>}]}/>
}
