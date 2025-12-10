import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./CommonHeader.module.css";
import { LogOut, Menu, Bell, BellOff } from "lucide-react";
import log from "./imgs/log.svg";
import BabySideNavi from "../babySideNavi/BabySideNavi";
import UseCommonHeader from "./UseCommonHeader";
import useAuthStore from "store/useStore";

const CommonHeader = ({ isLogin, alerts, setAlerts, setIsCounselOpen }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const { clickAlarm, newAlerts, setNewAlerts } = UseCommonHeader();

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isBellOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsBellOpen(false);
        setNewAlerts(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBellOpen]);

  const location = useLocation();

  const toggleSideNav = () => {
    setIsNavOpen(!isNavOpen);
    setIsBellOpen(false);
  };
  const closeSideNav = () => setIsNavOpen(false);

  const toggleBellDropdown = () => {
    setIsBellOpen((prev) => {
      const newState = !prev;
      if (newState === false) {
        setNewAlerts(false);
      }
      return newState;
    });
    setIsNavOpen(false);
  };

  const isPathActive = (path) => location.pathname.startsWith(path);

  const { logout } = useAuthStore((state) => state);
  const navi = useNavigate();

  return (
    <div>
      {isNavOpen && (
        <BabySideNavi
          onClose={closeSideNav}
          setIsNavOpen={setIsNavOpen}
          setIsCounselOpen={setIsCounselOpen}
        />
      )}

      <div className={styles.topbar}>
        <div className={styles.headerContentWrapper}>
          <div className={styles.leftSection}>
            <Link to="/">
              <img src={log} className={styles.logoIcon} alt="로고 이미지" />
            </Link>

            <div className={styles.menuItems}>
              <div
                className={`${styles.menuItemBox} ${isPathActive("/board") ? styles.menuActive : ""
                  }`}
              >
                <Link to="/board" className={styles.menuItem}>
                  커뮤니티
                </Link>
              </div>

              {isLogin && (
                <div
                  className={`${styles.menuItemBox} ${isPathActive("/mypage") ? styles.menuActive : ""
                    }`}
                >
                  <Link to="/mypage" className={styles.menuItem}>
                    마이페이지
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            {isLogin && (
              <>
                <div className={styles.notificationContainer}>
                  <button
                    onClick={toggleBellDropdown}
                    className={styles.iconButton}
                  >
                    <Bell
                      className={styles.bellIcon}
                      onClick={() => {
                        setNewAlerts(false);
                      }}
                    />
                    {newAlerts && <span className={styles.alertBadge} />}
                  </button>

                  {isBellOpen && (
                    <div className={styles.bellDropdown} ref={dropdownRef}>
                      <div className={styles.dropdownHeader}>
                        알림
                        {newAlerts && (
                          <span className={styles.newAlert}>New</span>
                        )}
                      </div>

                      {alerts.length > 0 ? (
                        alerts.map((alert, idx) => (
                          <div
                            key={idx}
                            className={styles.alertItem}
                            onClick={() => clickAlarm(alert, setAlerts)}
                          >
                            <p className={styles.alertContent}>
                              {alert.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noAlert}>
                          <BellOff className={styles.noAlertIcon} />
                          <span>알림이 없습니다</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className={styles.iconButton}
                  onClick={() => {
                    logout();
                    navi("/");
                  }}
                >
                  <LogOut className={styles.logoutIcon} />
                  <span className={styles.tooltip}>로그아웃</span>
                </button>
                <button onClick={toggleSideNav} className={styles.iconButton}>
                  <Menu className={styles.menuIcon} />
                </button>
              </>
            )}

            {!isLogin && (
              <div className={styles.authButtons}>
                <Link to="/signup" className={styles.signUpBtn}>
                  회원가입
                </Link>
                <Link to="/login" className={styles.loginBtn}>
                  로그인
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
