import React, { useEffect, useState } from 'react'
import ChatsList from '../components/ChatsList/ChatsList'
import ChatSpace from '../components/ChatSpace/ChatSpace'
import NavBar from '../components/NavBar/NavBar'
import useNavBarProperties from '../services/NavbarPropertiesStore'
import { Outlet, useNavigation } from 'react-router-dom'
import LoadingBar from '../components/LoadingBar'

const Messages = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    if (collapsed == false) {
      setCollapsed(true)
    }
  })

  useEffect(() => {
    if (navigation.state === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [navigation.state]);
  return (
    <>
      {loading && <LoadingBar />}
      <div className='messages'>
        <ChatsList />
        <Outlet />
      </div>
    </>
  )
}

export default Messages