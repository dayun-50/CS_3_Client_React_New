import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./CommonHeader.module.css";
import { HelpCircle, Menu, Bell } from "lucide-react";
import log from "./imgs/log.svg";
import BabySideNavi from "../babySideNavi/BabySideNavi";

const CommonHeader = ({ isLogin }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false); // 알림 드롭다운 상태 추가
  const location = useLocation();

  const toggleSideNav = () => {
    setIsNavOpen(!isNavOpen);
    setIsBellOpen(false); // 사이드바 열 때 알림 닫기
  };
  const closeSideNav = () => setIsNavOpen(false);

  const toggleBellDropdown = () => {
    setIsBellOpen(!isBellOpen);
    setIsNavOpen(false); // 알림 열 때 사이드바 닫기
  };

  const isPathActive = (path) => location.pathname === path;

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
                    <Bell className={styles.bellIcon} />
                  </button>

                  {/* 알림 드롭다운 콘텐츠 */}
                  {isBellOpen && (
                    <div className={styles.bellDropdown}>
                      <div className={styles.dropdownHeader}>
                        알림
                        <span className={styles.newAlert}>New</span>
                      </div>
                      <div className={styles.alertItem}>
                        <p className={styles.alertContent}>
                          새로운 댓글이 달렸어요.
                        </p>
                        <span className={styles.alertTime}>1분 전</span>
                      </div>
                      <div className={styles.alertItem}>
                        <p className={styles.alertContent}>
                          새로운 아기가 등록되었어요.
                        </p>
                        <span className={styles.alertTime}>1시간 전</span>
                      </div>
                      <div className={styles.alertItem}>
                        <p className={styles.alertContent}>
                          커뮤니티 인기글이 업데이트되었어요.
                        </p>
                        <span className={styles.alertTime}>어제</span>
                      </div>
                      <div className={styles.viewAll}>
                        <Link to="/notifications">모든 알림 보기</Link>
                      </div>
                    </div>
                  )}
                </div>

                <button className={styles.iconButton}>
                  <HelpCircle className={styles.helpIcon} />
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
