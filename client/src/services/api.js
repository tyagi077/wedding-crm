import axios from 'axios'

const api = axios.create({
   baseURL: 'http://localhost:5000/api',
  // baseURL:'https://wedding-crm-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api