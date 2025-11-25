// CommonHeader.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./CommonHeader.module.css";
import { HelpCircle, Menu } from "lucide-react";
import log from "./imgs/log.svg";
import BabySideNavi from "../babySideNavi/BabySideNavi";

const CommonHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const toggleSideNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeSideNav = () => {
    setIsNavOpen(false);
  };

  const isPathActive = (path) => location.pathname === path;

  return (
    <div>
      {isNavOpen && <BabySideNavi onClose={closeSideNav} />}

      <div className={styles.topbar}>
        <div className={styles.headerContentWrapper}>
          {/* Left Section (로고 및 메뉴) */}
          <div className={styles.leftSection}>
            {/* 로고 (홈 링크) */}
            <Link to="/">
              <img src={log} className={styles.logoIcon} alt="로고 이미지" />
            </Link>

            <div className={styles.menuItems}>
              {/* 커뮤니티 메뉴 */}
              <div
                className={`${styles.menuItemBox} ${
                  isPathActive("/board") ? styles.menuActive : ""
                }`}
              >
                <Link to="/board" className={styles.menuItem}>
                  커뮤니티
                </Link>
              </div>

              {/* 마이페이지 메뉴 */}
              <div
                className={`${styles.menuItemBox} ${
                  isPathActive("/mypage") ? styles.menuActive : ""
                }`}
              >
                <Link to="/mypage" className={styles.menuItem}>
                  마이페이지
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section (아이콘 버튼) */}
          <div className={styles.rightSection}>
            <button className={styles.iconButton}>
              <HelpCircle className={styles.helpIcon} />
            </button>
            <button onClick={toggleSideNav} className={styles.iconButton}>
              <Menu className={styles.menuIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
