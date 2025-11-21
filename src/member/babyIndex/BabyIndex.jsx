
import React, { useState } from "react";
import BabyBox from "./babyBox/BabyBox";
import BabyArticle from "./babyArticle/BabyArticle";
import BabyButton from "./babyButton/BabyButton";
import Counseling from "../../member/counseling/Counseling"; 
import styles from "./BabyIndex.module.css";

const BabyIndex = () => {
  const [showCounseling, setShowCounseling] = useState(false);

  return (
    <div className={styles.container}>
      {/* 왼쪽 섹션 */}
      <div className={styles.leftSection}>
        <div className={styles.babyBoxWrapper}>
          <BabyBox />
        </div>
        <div className={styles.babyButtonWrapper}>
          {/* 긴급 상담 클릭 시 showCounseling true */}
          <BabyButton onEmergencyClick={() => setShowCounseling(true)} />
        </div>
      </div>
      {/* 오른쪽 섹션 */}

      <div className={styles.rightSection}>
        <BabyArticle />
      </div>

      {/* 전체 화면을 덮는 긴급 상담 */}
      {showCounseling && (
        <div className={styles.counselingOverlay}>
          <Counseling onClose={() => setShowCounseling(false)} />
        </div>
      )}
    </div>
  );
};

export default BabyIndex;
