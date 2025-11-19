import React, { useState } from "react";
import { ChevronDown, Users, Globe, UploadCloud, X } from "lucide-react"; 
import styles from "./BoardWrite.module.css";

const CheckedCircleIcon = ({ color = "#f0d827", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.checkedRadioIcon}
  >
    {/* 배경 원 (노란색) */}
    <circle
      cx="12"
      cy="12"
      r="11"
      fill={color}
      stroke="#ccb623"
      strokeWidth="1.5"
    />
    {/* 체크 마크 (어두운 색) */}
    <path
      d="M7 12L10 15L17 8"
      stroke="#333"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const BoardWrite = () => {
  const handleBack = () => console.log("뒤로가기 버튼 클릭");
  const handleComplete = () => console.log("완료 버튼 클릭");

  // 'all' 또는 'member' 두 가지 값 중 하나를 가집니다. 기본값은 'all'
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  // 파일 상태 추가
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleVisibilityChange = (option) => {
    setSelectedVisibility(option);
  };

  // 파일 크기 포매터
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // 숫자를 소수점 두 자리까지 표시하고 단위와 함께 반환
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    // FileList 객체를 배열로 변환
    const files = Array.from(event.target.files);
    // 기존 파일 목록에 새 파일을 추가
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    // 파일 선택 입력 필드를 초기화하여 동일한 파일을 다시 선택할 수 있도록 함
    event.target.value = null;
  };

  // 파일 삭제 핸들러
  const handleFileRemove = (indexToRemove) => {
    // 인덱스를 사용하여 해당 파일만 제외하고 새 배열 생성
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

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
          />
        </div>
      </div>

      {/* 필터 및 공개 설정 그룹 */}
      <div className={styles.selectionGroup}>
        {/* 필터 선택 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>필터 선택</label>
          <div className={styles.selectField}>
            <span className={styles.selectText}>메시지</span>
            <ChevronDown size={24} className={styles.selectIcon} />
          </div>
        </div>

        {/* 공개 설정 */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>공개 설정</label>
          <div className={styles.radioGroup}>
            {/* 전체 옵션 */}
            <div
              className={`${styles.radioOption} ${
                selectedVisibility === "all" ? styles.activeRadio : ""
              }`}
              onClick={() => handleVisibilityChange("all")}
            >
              {/* 아이콘: 선택 상태에 따라 SVG 또는 Globe 아이콘 표시 */}
              {selectedVisibility === "all" ? (
                <CheckedCircleIcon />
              ) : (
                <Globe size={20} className={styles.radioIcon} />
              )}
              <span className={styles.radioText}>전체</span>
            </div>

            {/* 멤버 옵션 */}
            <div
              className={`${styles.radioOption} ${
                selectedVisibility === "member" ? styles.activeRadio : ""
              }`}
              onClick={() => handleVisibilityChange("member")}
            >
              {/* 아이콘: 선택 상태에 따라 SVG 또는 Users 아이콘 표시 */}
              {selectedVisibility === "member" ? (
                <CheckedCircleIcon />
              ) : (
                <Users size={20} className={styles.radioIcon} />
              )}
              <span className={styles.radioText}>맴버</span>
            </div>
          </div>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className={styles.editorArea}>
        <div className={styles.editorHeader}>
          <span className={styles.editorLabel}>글 작성 에디터</span>
        </div>
        <textarea
          placeholder="글 내용을 입력하세요..."
          className={styles.editorInput}
        ></textarea>
      </div>

      {/* 파일 업로드 영역 추가 */}
      <div className={styles.fileUploadArea}>
        <label className={styles.formLabel}>파일 첨부</label>
        <div className={styles.uploadContainer}>
          {/* 실제 파일 입력 필드 (숨김) */}
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
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
