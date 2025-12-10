import { use, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EverydayDetail.module.css";
import {
  Inbox,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  PlusCircle,
} from "lucide-react";
import EverydayWrite from "../everydayWrite/EverydayWrite";
import { UseEverydayDetail } from "./UseEverydayDetail";

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

const logItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EverydayDetail = ({
  currentDate,
  setCurrentDate,
  formatDateKr,
  fetchData,
  fetchAvgData,
  startDate,
  endDate,
  setAvg,
}) => {
  const {
    moveDate,
    typeMap,
    activeType,
    handleTypeClick,
    openModalForNewLog,
    closeModal,
    showModal,
    targetDayData,
    reverseTypeMap,
    setTargetDayData,
    handleUpdate,
    editMode,
    setEditMode,
    editData,
    setEditData,
    handleDelete,
    load
  } = UseEverydayDetail({ currentDate, setCurrentDate, fetchData });

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const dropdownRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdownIndex !== null) {
        const currentRef = dropdownRefs.current[openDropdownIndex];
        if (currentRef && !currentRef.contains(e.target)) {
          setOpenDropdownIndex(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownIndex]);

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
      <div className={styles.headerSection}>
        <div className={styles.dateNavigation}>
          <ChevronLeft
            className={styles.arrowIcon}
            onClick={() => moveDate(-1)}
          />
          <div className={styles.currentDate}>{formatDateKr(currentDate)}</div>
          <ChevronRight
            className={styles.arrowIcon}
            onClick={() => moveDate(1)}
          />
        </div>

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          className={styles.logListWrapper}
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {targetDayData
            .filter((item) => {
              if (activeType === "전체") return true;

              if (activeType === "배변") {
                return item.record_type.startsWith("toilet");
              }

              return reverseTypeMap[activeType] === item.record_type;
            })
            .map((item, i) => {
              const baseTypeKey = item.record_type.split("/")[0];
              const mappedType =
                baseTypeKey === "toilet"
                  ? "배변"
                  : Object.keys(reverseTypeMap).find(
                    (k) => reverseTypeMap[k] === baseTypeKey
                  );

              const info = typeMap[mappedType];
              const Icon = info.icon;
              const displayType =
                recordLabelMap[item.record_type] || info.label;

              const formatTime = (iso) => {
                const d = new Date(iso);
                return d.toLocaleString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              };

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
                        style={{ color: info.color }}>
                        {item.prevStart ? (
                          <>
                            <span className={styles.timeText}>
                              전일 <br />
                              {formatTime(item.prevStart)}
                            </span>

                          </>
                        ) : (
                          formatTime(item.created_at)
                        )}
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
                        ? <>
                          {formatSleep(item.amount_value)}
                          {item.nextTotal > 0 && (
                            <> <br /> (+ 익일 {formatSleep(item.nextTotal)}) </>
                          )}
                          {item.prevTotal > 0 && (
                            <> <br /> (+ 전일 {formatSleep(item.prevTotal)}) </>
                          )}
                        </>
                        : `${item.amount_value}${amountUnitMap[baseTypeKey]}`}
                    </div>


                  </div>

                  {item.user_id == sessionStorage.getItem("id") &&
                    (<>

                      <div
                        className={styles.actionButtonWrapper}
                        ref={(el) => (dropdownRefs.current[i] = el)}
                      >
                        <MoreVertical
                          className={styles.actionIcon}
                          onClick={() => toggleDropdown(i)}
                        />

                        {openDropdownIndex === i && (
                          <div className={styles.dropdownMenu}>
                            <div
                              className={styles.dropdownItem}
                              onClick={() => {
                                handleUpdate(item);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              수정
                            </div>
                            <div
                              className={styles.dropdownItem}
                              onClick={() => {
                                handleDelete(item);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              삭제
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                    )}
                </motion.div>
              );
            })}

          {targetDayData.length === 0 && (
            <div className={styles.emptyMessage}>
              <Inbox className={styles.emptyIcon} />
              <div>
                현재 {activeType} 기록이 없습니다
                {activeType !== "전체" && (
                  <p className={styles.emptySubText}>
                    상단의 '기록 추가' 버튼을 눌러 새로운 기록을 추가해보세요
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <EverydayWrite
            activeType={activeType}
            closeModal={closeModal}
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
            load={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EverydayDetail;
