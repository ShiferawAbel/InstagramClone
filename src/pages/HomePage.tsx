import React, { useEffect } from 'react'
import Posts from '../components/Posts/Posts'
import Stories from '../components/Stories/Stories'
import '../App.css'
import useNavBarProperties from '../services/NavbarPropertiesStore'

const HomePage = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  useEffect(() => {
    if (collapsed == true) {
    setCollapsed(false);
    }  
  })
  return (
    <>
      <Stories />
      <Posts />
    </>
  )
}

export default HomePage