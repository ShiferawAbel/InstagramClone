import React from 'react'
import ChatsList from '../components/ChatsList/ChatsList'
import ChatSpace from '../components/ChatSpace/ChatSpace'
import NavBar from '../components/NavBar/NavBar'
import useNavBarProperties from '../services/NavbarPropertiesStore'
import { Outlet } from 'react-router-dom'

const Messages = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  
  if (collapsed == false) {
    setCollapsed(true)
  }
  return (
    <div className='messages'>
      <ChatsList />
      <Outlet />
    </div>
  )
}

export default Messages