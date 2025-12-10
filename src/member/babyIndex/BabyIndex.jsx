import React, { useState } from "react";
import BabyBox from "./babyBox/BabyBox";
import BabyArticle from "./babyArticle/BabyArticle";
import BabyButton from "./babyButton/BabyButton";
import Counseling from "../../member/counseling/Counseling";
import styles from "./BabyIndex.module.css";

import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, delayChildren: 0.3, staggerChildren: 0.2 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
};

const BabyIndex = () => {
  const [showCounseling, setShowCounseling] = useState(false);
  const [isBorn, setIsBorn] = useState(false);

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.leftSection} variants={sectionVariants}>
        <div className={styles.babyBoxWrapper}>
          <BabyBox setIsBorn={setIsBorn} />
        </div>
        <div className={styles.babyButtonWrapper}>
          <BabyButton
            onEmergencyClick={() => setShowCounseling(true)}
            isBorn={isBorn}
          />
        </div>
      </motion.div>
      <motion.div className={styles.rightSection} variants={sectionVariants}>
        <BabyArticle />
      </motion.div>
      <AnimatePresence>
        {showCounseling && (
          <motion.div
            className={styles.counselingOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
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
