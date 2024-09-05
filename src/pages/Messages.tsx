import React from 'react'
import ChatsList from '../components/ChatsList/ChatsList'
import ChatSpace from '../components/ChatSpace/ChatSpace'

const Messages = () => {
  return (
    <div className='messages'>
      <ChatsList />
      <ChatSpace />
    </div>
  )
}

export default Messages