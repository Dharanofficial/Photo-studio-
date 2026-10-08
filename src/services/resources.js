import {collection} from './api'
// REST: GET/POST /api/<name>, PUT/DELETE /api/<name>/:id
export const portfolioService=collection('portfolio')
export const serviceService=collection('services')
export const packageService=collection('packages')
export const bookingService=collection('bookings')
export const inquiryService=collection('inquiries')
