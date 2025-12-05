import React, { useState } from "react";
import BabyBox from "./babyBox/BabyBox";
import BabyArticle from "./babyArticle/BabyArticle";
import BabyButton from "./babyButton/BabyButton";
import Counseling from "../../member/counseling/Counseling";
import styles from "./BabyIndex.module.css";

import { motion, AnimatePresence } from "framer-motion";

// 애니메이션
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, delayChildren: 0.3, staggerChildren: 0.2 }, // 시간 초, 지연시간, 숭차적
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0 }, // 조건부 렌더링
};

const BabyIndex = () => {
  const [showCounseling, setShowCounseling] = useState(false);
  const [isBorn, setIsBorn] = useState(false);
  //최상위에서 공유용으로 만드는 상태변수, 임신 or 육아 상태 구별용

  return (
    // 최상위 컨테이너에 motion.div 적용
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 왼쪽 섹션 */}
      <motion.div className={styles.leftSection} variants={sectionVariants}>
        <div className={styles.babyBoxWrapper}>
          <BabyBox setIsBorn={setIsBorn} />
        </div>
        <div className={styles.babyButtonWrapper}>
          {/* 긴급 상담 클릭 시 showCounseling true */}
          <BabyButton
            onEmergencyClick={() => setShowCounseling(true)}
            isBorn={isBorn}
          />
        </div>
      </motion.div>
      {/* 오른쪽 섹션 */}
      <motion.div className={styles.rightSection} variants={sectionVariants}>
        <BabyArticle />
      </motion.div>

      {/* 전체 화면을 덮는 긴급 상담 */}
      {/* AnimatePresence로 감싸야 exit 애니메이션이 작동 */}
      <AnimatePresence>
        {showCounseling && (
          <motion.div
            className={styles.counselingOverlay}
            initial="hidden"
            animate="visible"
            exit="exit" // showCounseling이 false가 될 때 exit 애니메이션 실행
            variants={overlayVariants}
          >
            <Counseling onClose={() => setShowCounseling(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BabyIndex;
