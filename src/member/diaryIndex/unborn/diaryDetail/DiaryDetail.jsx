import React from "react";
import styles from "./DiaryDetail.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { UseDiaryDetail } from "./UseDiaryDetail";
import { EditorContent } from "@tiptap/react";

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

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          [{selectedWeek}주차] {targetDiaryContent.title}
        </h2>
        <span className={styles.writer}>
          작성자: {targetDiaryContent.nickname}
        </span>
      </div>

      <div className={styles.contentBox}>
        {editor && <EditorContent editor={editor} />}
      </div>

      <div className={styles.actionButtons}>
        {id == targetDiaryContent.user_id && (
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
