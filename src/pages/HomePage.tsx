import React, { useEffect } from 'react'
import Posts from '../components/Posts/Posts'
import Stories from '../components/Stories/Stories'
import '../App.css'
import useNavBarProperties from '../services/NavbarPropertiesStore'
import TopNav from '../components/NavBar/TopNav'

const HomePage = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  useEffect(() => {
    if (collapsed == true) {
    setCollapsed(false);
    }  
  })
  return (
    <>
      <TopNav />
      <Stories />
      <Posts />
    </>
  )
}

export default HomePage