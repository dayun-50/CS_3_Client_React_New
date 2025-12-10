import React, { useState } from "react";
import styles from "./DiaryNavi.module.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UseDiaryNavi } from "./UseDiaryNavi";
import { BookOpenText } from "lucide-react";

const DiaryItem = ({ title = "산모일기 제목", date = "작성 날짜" }) => (
  <div className={styles.diaryItemContent}>
    <b className={styles.diaryTitle}>{title}</b>
    <div className={styles.diaryDate}>{date}</div>
  </div>
);

const DiaryNavi = ({
  selectedWeek,
  setSelectedWeek,
  selectedDiaryId,
  setSelectedDiaryId,
  getTargetWeekDiary,
  weekDiaries,
  handleAddDiary,
}) => {
  const { handleWeekClick, handleViewDiary, weekRefs } = UseDiaryNavi({
    selectedWeek,
    setSelectedWeek,
    selectedDiaryId,
    setSelectedDiaryId,
    getTargetWeekDiary,
    weekDiaries,
    handleAddDiary,
  });

  return (
    <div className={styles.naviContainer}>
      {weekDiaries.map((w) => {
        const isSelected = selectedWeek === w.week;
        const blockClass = isSelected
          ? styles.weekBlockSelected
          : styles.weekBlockInactive;

        return (
          <div
            key={w.id}
            ref={(el) => {
              weekRefs.current[w.week] = el;
            }}
            className={blockClass}
            onClick={() => handleWeekClick(w.week)}
          >
            <div className={styles.weekToggleHeader}>
              <div className={styles.weekTag}>
                <b className={styles.weekText}>{w.week}주차</b>
              </div>
              {isSelected && (
                <button
                  className={styles.addButton}
                  onClick={(e) => handleAddDiary(e, w.week)}
                >
                  <Plus size={20} color="#fff" />
                </button>
              )}
            </div>
            <div
              className={styles.diaryListWrapper}
              style={{
                maxHeight: isSelected ? "400px" : "0",
                opacity: isSelected ? 1 : 0,
                paddingTop: isSelected ? "10px" : "0",
              }}
            >
              <div className={styles.diaryList}>
                {Array.isArray(w.diaries) && w.diaries.length > 0 ? (
                  w.diaries.map((d, i) => {
                    const isSelectedDiary = selectedDiaryId === d.journal_seq;

                    return (
                      <button
                        key={d.journal_seq}
                        className={`${styles.diaryButton} ${isSelectedDiary ? styles.diaryButtonSelected : ""
                          }`}
                        onClick={(e) => handleViewDiary(e, d.journal_seq)}
                      >
                        <DiaryItem
                          title={`[${w.week}주차] ${i + 1}번째 일기`}
                          date={d.record_datetime.split("T")[0]}
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className={styles.emptyDiary}>
                    <BookOpenText size={48} className={styles.emptyDiaryIcon} />
                    <div className={styles.emptyDiaryMessage}>
                      아직 작성된 일기가 없습니다.
                      <p className={styles.emptyDiarySubText}>
                        새로운 추억을 기록해 보세요!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiaryNavi;
