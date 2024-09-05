import React from 'react'
import Posts from '../components/Posts/Posts'
import Stories from '../components/Stories/Stories'
import '../App.css'

const HomePage = () => {
  return (
    <>
      <Stories />
      <Posts />
    </>
  )
}

export default HomePage