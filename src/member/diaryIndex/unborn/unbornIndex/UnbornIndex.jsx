import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DiaryNavi from "../diaryNavi/DiaryNavi";
import DiaryDetail from "../diaryDetail/DiaryDetail";
import DiaryWrite from "../diaryWrite/DiaryWrite";
import styles from "./UnbornIndex.module.css";
import { UseUnBornDiaryIndex } from "./UseUnbornIndex";

// 모션
const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

//산모수첩 인덱스 "/diary/" 여기까지 라우팅
const UnBornDiaryIndex = () => {
  const {
    selectedWeek,
    setSelectedWeek,
    selectedDiaryId,
    setSelectedDiaryId,
    getTargetWeekDiary,
    weekDiaries,
    handleAddDiary,
    isSubmitting,
    setIsSubmitting
  } = UseUnBornDiaryIndex();

  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <DiaryNavi
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          selectedDiaryId={selectedDiaryId}
          setSelectedDiaryId={setSelectedDiaryId}
          getTargetWeekDiary={getTargetWeekDiary}
          weekDiaries={weekDiaries}
          handleAddDiary={handleAddDiary}
        />
      </div>

      <div className={styles.rigth}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path=""
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DiaryDetail
                    selectedWeek={selectedWeek}
                    setSelectedWeek={setSelectedWeek}
                    handleAddDiary={handleAddDiary}
                    setSelectedDiaryId={setSelectedDiaryId}
                    getTargetWeekDiary={getTargetWeekDiary}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </motion.div>
              }
            />

            <Route
              path="write"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DiaryWrite
                    getTargetWeekDiary={getTargetWeekDiary}
                    setSelectedDiaryId={setSelectedDiaryId}
                    selectedDiaryId={selectedDiaryId}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default UnBornDiaryIndex;
