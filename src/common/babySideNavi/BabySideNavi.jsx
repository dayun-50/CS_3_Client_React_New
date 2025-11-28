import styles from "./BabySideNavi.module.css";
import { X, LogOut } from "lucide-react";
import BabyController from "./babyController/BabyController";
import BabyButton from "../../member/babyIndex/babyButton/BabyButton";

const BabySideNavi = ({ onClose }) => {
  return (
    <>
      {/* 배경 오버레이 */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* 사이드바 패널 */}
      <div className={styles.sidContanier}>
        {/* 닫기 버튼 */}
        <div className={styles.del}>
          <X className={styles.helpIcon} onClick={onClose} />
        </div>
        {/* 카테고리 (세로 모드) */}
        <div className={styles.sidnavi}>
          {/* isVertical={true} - 세로 형태의 디자인 적용 */}
          <BabyButton isVertical={true} />
        </div>
        {/* 아기 리스트 (사이드바 모드 + 스크롤) */}
        <div className={styles.sidController}>
          {/* isSidebar={true} - 가로 바 형태의 디자인 적용 */}
          <BabyController isSidebar={true} />
        </div>
        {/* 로그아웃 버튼 */}
        <div className={styles.logoutContainer}>
          <button className={styles.logoutButton}>
            <LogOut /> 로그아웃
          </button>
        </div>
      </div>
    </>
  );
};

export default BabySideNavi;
