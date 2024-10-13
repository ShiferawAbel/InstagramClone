import React from 'react'
import styles from './NavBar.module.css'
import logo from './instagram-logo.png'
import chat from './dm.png'
import { Link } from 'react-router-dom'
const TopNav = () => {
  return (
    <div className={styles.topNav}>
      <img src={logo} className={styles.logoTop} alt="" />
      <Link to={`/messages`}>
      
      <img src={chat} className={styles.messageLink} alt="" />
      </Link>
    </div>
  )
}

export default TopNav