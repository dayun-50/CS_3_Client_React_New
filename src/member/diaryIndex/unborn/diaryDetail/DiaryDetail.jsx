import React from "react";
import styles from "./DiaryDetail.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { UseDiaryDetail } from "./UseDiaryDetail";
import { EditorContent } from "@tiptap/react";

// 산모수첩 상세 보기
const DiaryDetail = ({
  selectedWeek,
  handleAddDiary,
  setSelectedDiaryId,
  getTargetWeekDiary,
  setSelectedWeek,
  isSubmitting,
  setIsSubmitting
}) => {
  const {
    seq,
    navigate,
    targetDiaryContent,
    editor,
    id,
    handleDeleteDiary,
    handleUpdateDiary,
    isDeleting
  } = UseDiaryDetail({
    selectedWeek,
    setSelectedDiaryId,
    getTargetWeekDiary,
    setSelectedWeek,
  });

  /* 선택된 주차도 없고 시퀀스도 없을 때 */
  if (!selectedWeek && !seq) {
    return (
      <div className={styles.emptyStateContainer}>
        <CalendarDays size={50} className={styles.emptyIcon} />
        <div className={styles.emptyStateMessage}>
          작성한 내용이 존재하지 않습니다
          <p className={styles.emptySubText}>
            주차를 선택해 작성을 시작해 보세요
          </p>
        </div>
      </div>
    );
  }

  /* 선택된 주차는 있으나 일기를 선택하지 않앗을 경우 */
  if (selectedWeek && !seq) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.emptyStateMessage}>
          '{selectedWeek} 주차'의 일기를 선택 또는 작성해주세요
        </div>
        <button
          onClick={(e) => {
            handleAddDiary(e, selectedWeek);
          }}
          className={styles.writeLink}
        >
          새 기록 남기기
        </button>
      </div>
    );
  }

  /* 선택된 주차에 일기 내용이 있을 때 */
  return (
    <div className={styles.detailContainer}>
      {/* 제목/작성자 */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          [{selectedWeek}주차] {targetDiaryContent.title}
        </h2>
        <span className={styles.writer}>
          작성자: {targetDiaryContent.nickname}
        </span>
      </div>

      {/* 내용 */}
      <div className={styles.contentBox}>
        {editor && <EditorContent editor={editor} />}
      </div>

      {/* 수정/삭제 버튼 */}
      <div className={styles.actionButtons}>
        {id == targetDiaryContent.user_id && ( //자기가 써야지만 볼 수 있음
          <>
            <button
              disabled={isDeleting}
              className={styles.deleteButton}
              onClick={() => handleDeleteDiary(targetDiaryContent.journal_seq)}
            >
              삭제
            </button>
            <button
              disabled={isSubmitting}
              className={styles.editButton}
              onClick={() => {
                console.log(
                  targetDiaryContent.journal_seq,
                  "타겟저널시퀀스넘어가나 확인"
                );
                handleUpdateDiary(targetDiaryContent.journal_seq, selectedWeek);
              }}
            >
              수정
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiaryDetail;
