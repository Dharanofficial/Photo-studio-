import {http,isMock} from './api'
// Demo-only credentials; shown intentionally in Demo Mode.
export const DEMO={admin:{email:'admin@photostudio.demo',password:'Admin@123',name:'Studio Admin'},customer:{email:'customer@photostudio.demo',password:'Customer@123',name:'Demo Customer'}}
export async function login(email,password,role){
  if(!isMock)return http('POST','/api/auth/login',{email,password,role})
  await new Promise(r=>setTimeout(r,400))
  const d=DEMO[role]
  if(!d||d.email!==email.trim().toLowerCase()||d.password!==password)throw new Error('Invalid email or password')
  return {user:{email:d.email,name:d.name,role},token:'demo-token'}
}
