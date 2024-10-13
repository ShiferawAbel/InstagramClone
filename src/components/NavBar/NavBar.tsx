import styles from './NavBar.module.css'
import Logo from './instagram-logo.png'
import homeIcon from './homee.png'
import searchIcon from './search.png'
// import discoverIcon from './discover.png'
import messageIcon from './dm.png'
import notificationIcon from './notification.png'
import createIcon from './create.png'
import NavItem from './NavItem';
import Logo2 from '../../../public/iglogo.svg'
import testImg from '../Posts/tester.jpg'
import { getCsrfToken } from '../../pages/Login'
import apiClient from '../../services/apiClient'
import logOutIcon from './logout-icon.webp'
import useNavBarProperties from '../../services/NavbarPropertiesStore'
import { useState } from 'react'
import LoadingBar from '../LoadingBar'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const { collapsed, setCollapsed } = useNavBarProperties();
  const [ loggingOut, setLoggingOut ] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const navItemList = [
    {linkName: 'Home', homeIcon}
  ]

  const logout = async () => {
    const csrfToken = getCsrfToken();
    setLoggingOut(true);
    await apiClient.post("http://localhost:8000/api/logout", {}, {
      headers: {
        accept: "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      withXSRFToken: true,
      withCredentials: true,
    }).then(res => queryClient.invalidateQueries(['user', 'posts']));
    setLoggingOut(false)
    navigate('/login')
  }
  if (collapsed) return (
    <div className={styles.navBarCollapsed}>
      {loggingOut && <LoadingBar />}
        
      <div className={styles.logoContainerCollapsed}>
        <img src={Logo2} className={styles.logoImg2Collapsed} alt="" />
      </div>
      <NavItem collapsed={true} endPoint='/' linkName='Home' icon={homeIcon} />
      <NavItem collapsed={true} endPoint='/discover' linkName='Search' icon={searchIcon} />
      <NavItem collapsed={true} endPoint='/messages' linkName='Message' icon={messageIcon} />
      <NavItem collapsed={true} endPoint='' linkName='Notification' icon={notificationIcon} />
      <NavItem collapsed={true} endPoint='/newpost' linkName='Create' icon={createIcon} />
      <NavItem collapsed={true} endPoint='/profile' linkName='Profile' icon={testImg} />
      <div className={styles.navItemLinkCollapsed}>
        <div className={styles.navItemCollapsed} onClick={logout}>
          <div className={styles.navIconContainerCollapsed}>
              <img src={logOutIcon} className={styles.navIconCollapsed} alt="" />
          </div>
          <div className={styles.linkNameContainerCollapsed}>Logout</div>
        </div>
      </div>
    </div>
  )
  return (
    
    <div className={styles.navBar}>
      {loggingOut && <LoadingBar />}
      <div className={styles.logoContainer}>
        <img src={Logo} className={styles.logoImg} alt="" />
        <img src={Logo2} className={styles.logoImg2} alt="" />
        
      </div>
      <NavItem collapsed={false} endPoint='/' linkName='Home' icon={homeIcon} />
      <NavItem collapsed={false} endPoint='/discover' linkName='Search' icon={searchIcon} />
      <NavItem collapsed={false} endPoint='/messages' linkName='Message' icon={messageIcon} />
      <NavItem collapsed={false} endPoint='' linkName='Notification' icon={notificationIcon} />
      <NavItem collapsed={false} endPoint='/newpost' linkName='Create' icon={createIcon} />
      <NavItem collapsed={false} endPoint='/profile' linkName='Profile' icon={testImg} />
      <div className={styles.navItemLink}>
        <div className={styles.navItem} onClick={logout}>
          <div className={styles.navIconContainer}>
              <img src={logOutIcon} className={styles.navIcon} alt="" />
          </div>
          <div className={styles.linkNameContainer}>Logout</div>
        </div>
      </div>
    </div>

  )
}

export default NavBar