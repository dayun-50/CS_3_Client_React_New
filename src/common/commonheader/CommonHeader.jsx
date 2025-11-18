import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styles from "./CommonHeader.module.css";
import { HelpCircle, Menu } from "lucide-react"; // 아이콘

//로그인 여부에 따라 헤더 보이는것 조절 필요
const CommonHeader = () => {
  return (
    <div>
      <div className={styles.topbar}>
        <div className={styles.frameParent}>
          <div className={styles.frameGroup}>
            {/* Left Menu */}
            <div className={styles.leftSection}>
              {/* 로고 이미지 */}
              <img className={styles.logoIcon} alt="" />

              {/* 부모님 메뉴 */}
              <div className={styles.menuItems}>
                <div className={styles.menuActive}>
                  <b className={styles.menuItem}>커뮤니티</b>
                </div>
                <div className={styles.menuItemBox}>
                  <span className={styles.menuItem}>마이페이지</span>
                </div>
              </div>
            </div>

            {/* Right Icons */}
            <div className={styles.rightSection}>
              <HelpCircle className={styles.helpIcon} />
              <Menu className={styles.menuIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommonHeader;
