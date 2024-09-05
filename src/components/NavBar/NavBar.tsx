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
import axios from 'axios'
import useIsLoggedOut from '../../services/loggedOutStore'
import apiClient from '../../services/apiClient'
import logOutIcon from './logout-icon.webp'
const NavBar = () => {
  const { isLoggedOut, setIsLoggedOut } = useIsLoggedOut();
  const navItemList = [
    {linkName: 'Home', homeIcon}
  ]

  const logout = async () => {
    const csrfToken = getCsrfToken();
    await apiClient.post("http://localhost:8000/api/logout", {}, {
      headers: {
        accept: "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      withXSRFToken: true,
      withCredentials: true,
    });
    
  }
  return (
    
    <div className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={Logo} className={styles.logoImg} alt="" />
        <img src={Logo2} className={styles.logoImg2} alt="" />
        
      </div>
      <NavItem endPoint='/' linkName='Home' icon={homeIcon} />
      <NavItem endPoint='/discover' linkName='Search' icon={searchIcon} />
      <NavItem endPoint='/messages' linkName='Message' icon={messageIcon} />
      <NavItem endPoint='' linkName='Notification' icon={notificationIcon} />
      <NavItem endPoint='/newpost' linkName='Create' icon={createIcon} />
      <NavItem endPoint='/profile' linkName='Profile' icon={testImg} />
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