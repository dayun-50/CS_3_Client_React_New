import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EverydayDetail.module.css";
import {
  Milk,
  Droplets,
  Soup,
  Moon,
  Thermometer,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  PlusCircle,
} from "lucide-react";
import EverydayWrite from "../everydayWrite/EverydayWrite";
import { UseEverydayDetail } from "./UseEverydayDetail";



// 로그 리스트 컨테이너 애니메이션 Variants
const listContainerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

// 개별 로그 항목 애니메이션 Variants
const logItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EverydayDetail = ({ currentDate, setCurrentDate, formatDateKr, fetchData, fetchAvgData, startDate, endDate, setAvg }) => {
  const {
    moveDate,
    typeMap,
    activeType,
    handleTypeClick,
    openModalForNewLog,
    closeModal,
    showModal,
    //typeToAdd,
    targetDayData,
    reverseTypeMap,
    setTargetDayData,
    handleUpdate,
    editMode,
    setEditMode,
    editData,
    setEditData
  } = UseEverydayDetail({ currentDate, setCurrentDate, fetchData });


  const recordLabelMap = {
    "toilet/pee": "소변",
    "toilet/poop": "대변",
  };
  const amountUnitMap = {
    milk: "ml",
    baby_food: "ml",
    sleep: "",
    temperature: "°C",
    toilet: "회",
  };



  return (
    <div className={styles.detailContainer}>
      {/* Header & 날짜 */}
      <div className={styles.headerSection}>
        <div className={styles.dateNavigation}>
          <ChevronLeft className={styles.arrowIcon} onClick={() => moveDate(-1)} />
          <div className={styles.currentDate}>{formatDateKr(currentDate)}</div>
          <ChevronRight className={styles.arrowIcon} onClick={() => moveDate(1)} />
        </div>

        {/* 타입 필터 버튼 */}
        <div className={styles.categoryFilters}>
          {Object.entries(typeMap).map(([key, info]) => (
            <div
              key={key}
              className={`${styles.filterButton} ${key === "전체" ? styles.fullButton : ""
                } ${activeType === key ? styles.filterButtonActive : ""}`}
              onClick={() => handleTypeClick(key)}
            >
              {info.icon && (
                <info.icon
                  size={18}
                  style={{ color: activeType === key ? info.color : "#8c8c8c" }}
                />
              )}
              <div
                className={styles.filterText}
                style={{ color: activeType === key ? info.color : "#696b70" }}
              >
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 기록 추가 버튼 (전체 선택 시 숨김) */}
      {activeType !== "전체" && (
        <div className={styles.addButtonWrapper}>
          <button
            className={styles.addButton}
            onClick={() => openModalForNewLog(activeType)}
          >
            <PlusCircle size={20} className={styles.addIcon} />
            <span className={styles.addText}>{activeType} 기록 추가</span>
          </button>
        </div>
      )}

      {/* 로그 리스트 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeType} // activeType 변경 시 애니메이션 발생
          className={styles.logListWrapper}
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {targetDayData
            .filter(item => {
              if (activeType === "전체") return true;

              if (activeType === "배변") {
                return item.record_type.startsWith("toilet");
              }

              return reverseTypeMap[activeType] === item.record_type;
            })
            .map((item, i) => {
              // 1) 타입 찾기 (toilet / milk / sleep ...)
              const baseTypeKey = item.record_type.split("/")[0];

              // 2) toilet → "배변"
              const mappedType =
                baseTypeKey === "toilet"
                  ? "배변"
                  : Object.keys(reverseTypeMap).find(
                    k => reverseTypeMap[k] === baseTypeKey
                  );

              const info = typeMap[mappedType];
              const Icon = info.icon;

              // 3) 최종 표시 이름 (소변/대변 or label)
              const displayType =
                recordLabelMap[item.record_type] || info.label;

              // 4) 날짜 변환
              const formatTime = (iso) => {
                const d = new Date(iso);
                return d.toLocaleString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
              };

              //5)수면시간 포맷
              const formatSleep = (minutes) => {
                const h = Math.floor(minutes / 60);
                const m = minutes % 60;
                return `${h}시간 ${m}분`;
              };

              return (
                <motion.div
                  key={i}
                  className={styles.logEntry}
                  style={{ borderLeft: `4px solid ${info.color}` }}
                  variants={logItemVariants}
                >
                  <div className={styles.logTimeWrapper}>
                    <div
                      className={styles.timeLine}
                      style={{ backgroundColor: info.color }}
                    />
                    <div className={styles.timeLabel}>
                      <div
                        className={styles.timeText}
                        style={{ color: info.color }}
                      >
                        {formatTime(item.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.logContent}>
                    {Icon && (
                      <Icon
                        className={styles.logIconSvg}
                        style={{ color: info.color }}
                      />
                    )}
                    <div className={styles.logType}>{displayType}</div>
                    <div className={styles.logAmount}>
                      {baseTypeKey === "sleep"
                        ? formatSleep(item.amount_value)
                        : `${item.amount_value}${amountUnitMap[baseTypeKey]}`}
                    </div>
                  </div>

                  <div className={styles.actionButtonWrapper}>
                    <button>삭제</button>
                    <button onClick={() => { handleUpdate(item) }}>수정</button>
                    <MoreVertical className={styles.actionIcon} />
                  </div>
                </motion.div>
              );
            })}

          {/* 로그 없을 경우 */}
          {targetDayData.length === 0 && (
            <div className={styles.noLogMessage}>
              현재 {activeType} 기록이 없습니다. 상단의 '기록 추가' 버튼을
              눌러주세요.
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 모달 */}
      {/* showModal 상태가 true일 때만 EverydayWrite 컴포넌트 렌더링 */}
      <AnimatePresence>
        {showModal && (
          <EverydayWrite
            activeType={activeType}
            closeModal={closeModal}
            // EverydayWrite 내부에서 AnimatePresence가 showModal을 대신하도록 isOpen prop을 전달
            isOpen={showModal}
            currentDate={currentDate}
            fetchData={fetchData}
            reverseTypeMap={reverseTypeMap}
            setTargetDayData={setTargetDayData}
            fetchAvgData={fetchAvgData}
            startDate={startDate}
            endDate={endDate}
            setAvg={setAvg}
            targetDayData={targetDayData}
            editMode={editMode}
            setEditMode={setEditMode}
            editData={editData}
            setEditData={setEditData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EverydayDetail;
