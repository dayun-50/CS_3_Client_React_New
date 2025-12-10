import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EverydayWrite.module.css";
import { UseEverydayWrite } from "./UseEverydayWrite";

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
const containerVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.2 } },
};

const EverydayWrite = ({
  activeType,
  closeModal,
  isOpen,
  currentDate,
  fetchData,
  reverseTypeMap,
  setTargetDayData,
  fetchAvgData,
  startDate,
  endDate,
  setAvg,
  targetDayData,
  editMode,
  setEditMode,
  editData,
  setEditData,
  load,
}) => {
  const {
    getLogDetails,
    handleAdd,
    time,
    setTime,
    pooType,
    setPooType,
    amountValue,
    setAmountValue,
    setSleepStart,
    setSleepEnd,
    sleepStart,
    sleepEnd,
    startMin,
    startMax,
    endMin,
    endMax,
    isSubmitting,
  } = UseEverydayWrite({
    closeModal,
    currentDate,
    fetchData,
    reverseTypeMap,
    setTargetDayData,
    fetchAvgData,
    startDate,
    endDate,
    setAvg,
    targetDayData,
    editMode,
    setEditMode,
    editData,
    setEditData,
    activeType,
    load,
  });

  const { unit, inputType, label, options } = getLogDetails(activeType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeModal}
        >
          <motion.div
            className={styles.writeContainer}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.contentWrapper}>
              <div className={styles.categoryTitleWrapper}>
                <div className={styles.categoryTitle}>{activeType} 기록</div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputBox}>
                  {activeType === "수면" ? (
                    <>
                      <div className={styles.inputLabel}>시간</div>
                      <input
                        type="datetime-local"
                        className={styles.timeInput}
                        value={sleepStart}
                        min={startMin}
                        max={startMax}
                        onChange={(e) => setSleepStart(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <div className={styles.inputLabel}>시간</div>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </>
                  )}
                </div>

                {inputType === "group" && (
                  <div className={styles.inputBox}>
                    <div className={styles.inputLabel}>종류</div>
                    <div className={styles.radioGroup}>
                      {options.type.map((t) => (
                        <label key={t} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="pooType"
                            value={t}
                            checked={pooType === t}
                            onChange={() => setPooType(t)}
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeType === "수면" && (
                  <div className={styles.inputBox}>
                    <div className={styles.inputLabel}>시간</div>
                    <input
                      type="datetime-local"
                      className={styles.timeInput}
                      value={sleepEnd}
                      min={endMin}
                      max={endMax}
                      onChange={(e) => setSleepEnd(e.target.value)}
                    />
                  </div>
                )}

                {["number", "text"].includes(inputType) && (
                  <div className={styles.inputBox}>
                    <div className={styles.inputLabel}>{label}</div>
                    <div className={styles.amountInputWrapper}>
                      <input
                        type={inputType}
                        placeholder={`${label}을 입력하세요`}
                        step={activeType === "체온" ? "0.1" : "1"}
                        className={styles.amountInput}
                        value={amountValue}
                        onChange={(e) => setAmountValue(e.target.value)}
                      />

                      {unit && (
                        <div className={styles.unitBox}>
                          <div className={styles.unitText}>{unit}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionButtonsWrapper}>
                <div className={styles.actionButtonsContainer}>
                  <button
                    className={`${styles.actionButton} ${styles.backButton}`}
                    onClick={closeModal}
                  >
                    <div className={styles.buttonText}>뒤로가기</div>
                  </button>

                  <button
                    className={`${styles.actionButton} ${styles.completeButton}`}
                    onClick={() => handleAdd(activeType)}
                    disabled={isSubmitting}
                  >
                    <div className={styles.buttonTextBold}>완료</div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EverydayWrite;
