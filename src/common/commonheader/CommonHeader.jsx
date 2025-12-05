import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./CommonHeader.module.css";
import { LogOut, Menu, Bell, BellOff } from "lucide-react";
import log from "./imgs/log.svg";
import BabySideNavi from "../babySideNavi/BabySideNavi";
import UseCommonHeader from "./UseCommonHeader";
import useAuthStore from "store/useStore";

const CommonHeader = ({
  isLogin,
  alerts,
  setAlerts
}) => {
  const { id } = useAuthStore((state) => state);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false); // 알림 드롭다운 상태 추가

  const location = useLocation();
  const { clickAlarm, newAlerts, setNewAlerts } = UseCommonHeader();

  const toggleSideNav = () => {
    setIsNavOpen(!isNavOpen);
    setIsBellOpen(false); // 사이드바 열 때 알림 닫기
  };
  const closeSideNav = () => setIsNavOpen(false);

  const toggleBellDropdown = () => {
    setIsBellOpen((prev) => {
      const newState = !prev;
      if (newState === false) {
        // 드롭다운을 닫을 때 newAlerts false로
        setNewAlerts(false);
      }
      return newState;
    });
    setIsNavOpen(false); // 알림 열 때 사이드바 닫기
  };

  const isPathActive = (path) => location.pathname === path;

  // 로그아웃
  const { logout } = useAuthStore((state) => state);
  const navi = useNavigate();

  return (
    <div>
      {isNavOpen && <BabySideNavi onClose={closeSideNav} />}

      <div className={styles.topbar}>
        <div className={styles.headerContentWrapper}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <Link to="/">
              <img src={log} className={styles.logoIcon} alt="로고 이미지" />
            </Link>

            <div className={styles.menuItems}>
              {/* 커뮤니티 메뉴 (항상 보임) */}
              <div
                className={`${styles.menuItemBox} ${
                  isPathActive("/board") ? styles.menuActive : ""
                }`}
              >
                <Link to="/board" className={styles.menuItem}>
                  커뮤니티
                </Link>
              </div>

              {/* 로그인한 경우만 마이페이지 표시 */}
              {isLogin && (
                <div
                  className={`${styles.menuItemBox} ${
                    isPathActive("/mypage") ? styles.menuActive : ""
                  }`}
                >
                  <Link to="/mypage" className={styles.menuItem}>
                    마이페이지
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className={styles.rightSection}>
            {/* 로그인한 경우만 아이콘 표시 */}
            {isLogin && (
              <>
                {/* 알림 버튼과 드롭다운 컨테이너 */}
                <div className={styles.notificationContainer}>
                  <button
                    onClick={toggleBellDropdown}
                    className={styles.iconButton}
                  >
                    <Bell className={styles.bellIcon} onClick={()=>{setNewAlerts(false)}}/>
                    {newAlerts && <span className={styles.alertBadge} />}
                  </button>

                  {isBellOpen && (
                    <div className={styles.bellDropdown}>
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
                            onClick={() => clickAlarm(alert , setAlerts)}
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

            {/* 로그인 안했을 때만 로그인/회원가입 버튼 표시 */}
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
