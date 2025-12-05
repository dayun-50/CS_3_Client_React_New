import React, { useState } from "react";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import styles from "./BoardWrite.module.css";
import { UseBoardWrite } from "./UseBoardWrite";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const BoardWrite = () => {
  const {
    handleBack,
    handleComplete,
    handleVisibilityChange,
    handleSelect,
    setIsOpen,
    setUploadedFiles,
    formatFileSize,
    handleFileSelect,
    handleFileRemove,
    setInEditorUploadFiles,

    setEditorInstance,
    titleRef,
    editorRef,
    uploadedFiles,
    options,
    isOpen,
    selected,
    selectedVisibility,
  } = UseBoardWrite();

  return (
    <div className={styles.editorContainer}>
      {/* 제목 입력 영역 */}
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

      {/* 필터 및 공개 설정 그룹 */}
      <div className={styles.selectionGroup}>
        {/* 필터 선택 */}
        <div className={styles.formGroup} style={{ position: "relative" }}>
          <label className={styles.formLabel}>필터 선택</label>
          <div
            className={styles.selectField}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={styles.selectText}>{selected}</span>
            <ChevronDown size={24} className={styles.selectIcon} />
          </div>

          {/* 옵션 리스트 */}
          {isOpen && (
            <div className={styles.dropdownOptions}>
              {options.map((option) => (
                <div
                  key={option}
                  className={styles.dropdownOption}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 공개 설정 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>공개 설정</label>
          <div className={styles.radioGroup}>
            {/* 전체 옵션 */}
            <label
              htmlFor="visibility-all"
              className={`${styles.radioOption} ${
                selectedVisibility === "all" ? styles.activeRadio : ""
              }`}
            >
              <input
                type="radio"
                id="visibility-all"
                name="visibility"
                value="all"
                checked={selectedVisibility === "all"}
                onChange={() => handleVisibilityChange("all")}
                className={styles.hiddenRadio}
              />
              <span>전체</span>
            </label>

            {/* 멤버 옵션 */}
            <label
              htmlFor="visibility-member"
              className={`${styles.radioOption} ${
                selectedVisibility === "member" ? styles.activeRadio : ""
              }`}
            >
              <input
                type="radio"
                id="visibility-member"
                name="visibility"
                value="member"
                checked={selectedVisibility === "member"}
                onChange={() => handleVisibilityChange("member")}
                className={styles.hiddenRadio}
              />
              <span>멤버</span>
            </label>
          </div>
        </div>
      </div>

      {/* 파일 업로드 영역 추가 */}
      <div className={styles.fileUploadArea}>
        <label className={styles.formLabel}>파일 첨부</label>
        <div className={styles.uploadContainer}>
          {/* 실제 파일 입력 필드 */}
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          {/* 사용자에게 보이는 업로드 버튼 (label을 사용하여 input을 클릭) */}
          <label htmlFor="file-upload" className={styles.uploadButton}>
            <UploadCloud size={20} />
            <span>파일 선택 또는 드래그 앤 드롭</span>
          </label>

          {/* 업로드된 파일 목록 */}
          {uploadedFiles.length > 0 && (
            <div className={styles.list}>
              <ul className={styles.fileList}>
                {uploadedFiles.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      ({formatFileSize(file.size)})
                    </span>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className={styles.removeFileButton}
                      aria-label={`${file.name} 파일 삭제`}
                    >
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className={styles.editorArea}>
        <SimpleEditor
          ref={editorRef}
          setInEditorUploadFiles={setInEditorUploadFiles}
          setEditorInstance={setEditorInstance}
          uploadType="board"
        />
      </div>

      {/* 액션 버튼 */}
      <div className={styles.actionFooter}>
        <button onClick={handleBack} className={styles.backButton}>
          뒤로가기
        </button>
        <button onClick={handleComplete} className={styles.completeButton}>
          완료
        </button>
      </div>
    </div>
  );
};

export default BoardWrite;
