import React from "react";
import { motion } from "framer-motion";
import styles from "./SymptomList.module.css";
import { FETAL_CHECKLIST, BABY_CHECKLIST } from "./list";

// --- CheckItem ---
const CheckItem = ({ check, index }) => (
  <div
    className={styles.checkWrapper}
  >
    <div className={styles.checkRow}>
      <div className={styles.checkLeft}>
        <div className={styles.checkIconDone} />
        <span className={styles.checkTitle}>{check.title}</span>
      </div>
    </div>
  </div>
);

// --- WeekSection ---
const WeekSection = ({ data, index, isInfant }) => {
  const title = isInfant ? data.month : data.week;

  return (
    <div
      className={styles.weekSection}
    >
      <div className={styles.itemActive} />
      <div className={styles.weekContent}>
        <div className={styles.weekTitleWrapper}>
          <span className={styles.weekTitle}>{title}</span>
        </div>
        <div className={styles.checkList}>
          {data.checks.map((check, i) => (
            <CheckItem key={check.id} check={check} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SymptomList 메인 ---
const SymptomList = ({ babyData }) => {
  if (!babyData) return null;

  const isInfant = babyData.status === "infant";
  const checklist = isInfant ? BABY_CHECKLIST : FETAL_CHECKLIST;

  return (
    <div className={styles.main}>
      <div className={styles.lineWrapper}>
        <div className={styles.timelineLine} />
      </div>
      <div className={styles.sectionList}>
        {checklist.map((section, i) => (
          <WeekSection
            key={section.id}
            data={section}
            index={i}
            isInfant={isInfant}
          />
        ))}
      </div>
    </div>
  );
};

export default SymptomList;
