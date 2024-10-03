import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import useUserStore from "../../services/userStore";

interface Props {
  linkName: string;
  icon: string;
  endPoint: string;
  collapsed: boolean;
}

const NavItem = ({ linkName, icon, endPoint, collapsed }: Props) => {
  const user = useUserStore.getState().user;
  return (
    <NavLink to={endPoint} className={styles.navItemLink + " " + icon}>
      {collapsed ? (
        <div className={styles.navItemCollapsed}>
          <div className={styles.navIconContainerCollapsed}>
            {endPoint == "/profile" ? (
              <img
                src={user.profileUrl}
                className={styles.profileImg}
                alt=""
              />
            ) : (
              <img src={icon} className={styles.navIconCollapsed} alt="" />
            )}
          </div>
          <div className={styles.linkNameContainerCollapsed}>
            {endPoint == "/profile" ? user.userName : linkName}
          </div>
        </div>
      ) : (
        <div className={styles.navItem}>
          <div className={styles.navIconContainer}>
            {endPoint == "/profile" ? (
              <img src={user.profileUrl} className={styles.profileImg} alt="" />
            ) : (
              <img src={icon} className={styles.navIcon} alt="" />
            )}
          </div>
          <div className={styles.linkNameContainer}>
            {endPoint == "/profile" ? user.userName : linkName}
          </div>
        </div>
      )}
    </NavLink>
  );
};

export default NavItem;
