import React from 'react'
import Posts from '../components/Posts/Posts'
import Stories from '../components/Stories/Stories'
import '../App.css'
import useNavBarProperties from '../services/NavbarPropertiesStore'

const HomePage = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  if (collapsed == true) {
    setCollapsed(false);
  }
  return (
    <>
      <Stories />
      <Posts />
    </>
  )
}

export default HomePage