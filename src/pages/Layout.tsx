import React, { useState } from 'react'
import { Outlet, useNavigate, useNavigation } from 'react-router-dom'
import NavBar from '../components/NavBar/NavBar'
import useUserStore from '../services/userStore'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getCsrfToken } from './Login'
import logo from '../../public/iglogo.svg'
import { User } from '../components/Posts/PostCard'

export interface FetchAuthUser {
  user: User;
}
const Layout = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate()
  const csrfToken = getCsrfToken();
  const [err, setErr] = useState<Error>()
  const { data, isLoading } = useQuery<User, Error>({
      queryKey: ["user"],
      queryFn: async () =>
        await axios.get<FetchAuthUser>('http://localhost:8000/api/v1/user', {
          headers: {
            accept: 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        }).then(res => {

          setUser(res.data.user)
          return res.data.user
      }),
      onError: (error) => {
        setErr(error)
      },
      retry: 0,
      staleTime: 1000,
      refetchInterval: 1000,
    });
  if (err && err.message == 'Request failed with status code 401') {
    navigate('/login')
  }
  if (isLoading) {
    return <div className='appLoaderContainer'><img className='appLoader' src={logo}></img></div>
  }
  return (
    <>
    
      <NavBar />
      <div className='mainPage'>
        <Outlet />
      </div>
    </>
  )
}

export default Layout