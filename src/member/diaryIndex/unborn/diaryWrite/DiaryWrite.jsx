import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiaryWrite.module.css";
import { UseDiaryWrite } from "./UseDiaryWrite";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const DiaryWrite = ({ getTargetWeekDiary, setSelectedDiaryId, selectedDiaryId, setIsSubmitting }) => {
  const {
    titleRef,
    content,
    handleComplete,
    editorRef,
    setEditorInstance

  } = UseDiaryWrite({ getTargetWeekDiary, setSelectedDiaryId, selectedDiaryId, setIsSubmitting });


  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* 제목 입력 */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>제목</label>
        <div className={styles.inputField}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className={styles.inputElement}
            ref={titleRef}
          />
        </div>
      </div>

      {/* 글 작성 */}
      <label className={styles.formLabel}>글 작성</label>
      <div className={styles.editorArea} ref={editorRef} >
        <SimpleEditor setEditorInstance={setEditorInstance} uploadType="diary" />
      </div>

      {/* 버튼 */}
      <div className={styles.actionFooter}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          뒤로가기
        </button>
        <button className={styles.completeButton} onClick={handleComplete}>
          완료
        </button>
      </div>
    </div>
  );
};

export default DiaryWrite;
