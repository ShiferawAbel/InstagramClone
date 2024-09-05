import axios from "axios";
import { getCsrfToken } from "../pages/Login";

const csrfToken = getCsrfToken();
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'XSRF-TOKEN': csrfToken,
  }
})

export default apiClient