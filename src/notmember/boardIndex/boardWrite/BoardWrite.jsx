import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import styles from "./BoardWrite.module.css";
import { UseBoardWrite } from "./UseBoardWrite";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import Loading from "common/loading/Loading";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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
    isSubmitting,
  } = UseBoardWrite();

  return (
    <motion.div
      className={styles.editorContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.formGroup} variants={itemVariants}>
        <label className={styles.formLabel}>제목</label>
        <div className={styles.inputField}>
          <input
            type="text"
            placeholder="제목을 입력하세요 (최대 30글자)"
            className={styles.inputElement}
            ref={titleRef}
          />
        </div>
      </motion.div>

      <motion.div className={styles.selectionGroup} variants={itemVariants}>
        <div className={styles.formGroup} style={{ position: "relative" }}>
          <label className={styles.formLabel}>필터 선택</label>
          <div
            className={styles.selectField}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={styles.selectText}>{selected}</span>
            <ChevronDown size={24} className={styles.selectIcon} />
          </div>

          {isOpen && (
            <motion.div
              className={styles.dropdownOptions}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {options.map((option) => (
                <div
                  key={option}
                  className={styles.dropdownOption}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>공개 설정</label>
          <div className={styles.radioGroup}>
            <label
              htmlFor="visibility-all"
              className={`${styles.radioOption} ${selectedVisibility === "all" ? styles.activeRadio : ""
                }`}
            >
              <input
                type="radio"
                id="visibility-all"
                name="visibility"
                value="all"
                checked={selectedVisibility === "all"}
                onChange={() => handleVisibilityChange("all")}
              />
              <span>전체</span>
            </label>

            <label
              htmlFor="visibility-member"
              className={`${styles.radioOption} ${selectedVisibility === "member" ? styles.activeRadio : ""
                }`}
            >
              <input
                type="radio"
                id="visibility-member"
                name="visibility"
                value="member"
                checked={selectedVisibility === "member"}
                onChange={() => handleVisibilityChange("member")}
              />
              <span>멤버</span>
            </label>
          </div>
        </div>
      </motion.div>

      <motion.div className={styles.fileUploadArea} variants={itemVariants}>
        <label className={styles.formLabel}>파일 첨부</label>
        <div className={styles.uploadContainer}>
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileSelect}
            className={styles.fileInput}
          />

          <label htmlFor="file-upload" className={styles.uploadButton}>
            <UploadCloud size={20} />
            <span>파일 선택 (최대 7개)</span>
          </label>

          {uploadedFiles.length > 0 && (
            <motion.div
              className={styles.list}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
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
                    >
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div className={styles.editorArea} variants={itemVariants}>
        <SimpleEditor
          ref={editorRef}
          setInEditorUploadFiles={setInEditorUploadFiles}
          setEditorInstance={setEditorInstance}
          uploadType="board"
        />
      </motion.div>

      <motion.div
        className={styles.actionFooter}
        variants={itemVariants}
        style={{ display: "flex", gap: "16px" }}
      >
        <button onClick={handleBack} className={styles.backButton}>
          뒤로가기
        </button>
        <button
          onClick={handleComplete}
          className={styles.completeButton}
          disabled={isSubmitting}
        >
          완료
        </button>
      </motion.div>
      {isSubmitting && (
        <Loading message="잠시만 기다려주세요. 정보를 빠르게 준비하고 있습니다." />
      )}
    </motion.div>
  );
};

export default BoardWrite;
