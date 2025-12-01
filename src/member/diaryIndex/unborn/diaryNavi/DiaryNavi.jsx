import React, { useState } from "react";
import styles from "./DiaryNavi.module.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UseDiaryNavi } from "./UseDiaryNavi";


// 일기 항목 개별 컴포넌트
const DiaryItem = ({ title = "산모일기 제목", date = "작성 날짜" }) => (
  <div className={styles.diaryItemContent}>
    <b className={styles.diaryTitle}>{title}</b>
    <div className={styles.diaryDate}>{date}</div>
  </div>
);


// 산모수첩 주차별 네비
const DiaryNavi = ({ selectedWeek, setSelectedWeek, selectedDiaryId, setSelectedDiaryId, getTargetWeekDiary, weekDiaries, handleAddDiary }) => {
  const {
    handleWeekClick,
    handleViewDiary,
    weekRefs,
  } = UseDiaryNavi({ selectedWeek, setSelectedWeek, selectedDiaryId, setSelectedDiaryId, getTargetWeekDiary, weekDiaries, handleAddDiary });



  return (
    <div className={styles.naviContainer}>


      {weekDiaries.map((w) => {
        const isSelected = selectedWeek === w.week;

        // 선택되면 selected, 아니면 inactive 클래스를 적용
        const blockClass = isSelected
          ? styles.weekBlockSelected
          : styles.weekBlockInactive;

        return (
          <div
            key={w.id}
            ref={el => {
              weekRefs.current[w.week] = el;
            }}
            className={blockClass}
            onClick={() => handleWeekClick(w.week)}
          >


            {/* ================= 주차 상단 헤더 ================= */}
            {/* 주차 제목과 플러스 버튼을 포함하는 토글 헤더 영역 (스타일링/컨테이너) */}
            <div className={styles.weekToggleHeader}>
              {/* 1. 주차 태그 (항상 표시) */}
              <div className={styles.weekTag}>
                <b className={styles.weekText}>{w.week}주차</b>
              </div>

              {/* 2. 플러스 버튼 (선택된 경우에만 표시) */}
              {isSelected && (
                <button
                  className={styles.addButton}
                  onClick={(e) => handleAddDiary(e, w.week)}
                >
                  <Plus size={20} color="#fff" />
                </button>
              )}
            </div>


            {/* ================= 일기 리스트 영역 ================= */}
            {/* 일기 목록 래퍼 (펼쳐짐 애니메이션 적용) */}
            <div
              className={styles.diaryListWrapper}
              style={{
                maxHeight: isSelected ? "400px" : "0",
                opacity: isSelected ? 1 : 0,
                paddingTop: isSelected ? "10px" : "0",// 패딩도 애니메이션 대상에 포함시키기 위해 동적 설정
              }}
            >

              <div className={styles.diaryList}>
                {Array.isArray(w.diaries) && w.diaries.length > 0
                  ? (
                    w.diaries.map((d, i) => {
                      // 현재 일기의 고유 ID와 선택 상태 확인
                      const isSelectedDiary = selectedDiaryId === d.journal_seq;

                      return (
                        <button
                          key={d.journal_seq}
                          // isSelectedDiary 값에 따라 클래스 동적 적용
                          className={`${styles.diaryButton} ${isSelectedDiary ? styles.diaryButtonSelected : ""
                            }`}
                          onClick={(e) => handleViewDiary(e, d.journal_seq)}
                        >
                          <DiaryItem

                            title={`[${w.week}주차] ${i + 1}번째 일기`}
                            date={`2025-11-25`}
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className={styles.emptyDiary}>
                      아직 작성된 일기가 없습니다.
                    </div>
                  )
                }

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiaryNavi;
