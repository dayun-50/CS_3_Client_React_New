import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./PrenatalList.module.css";
import { FETAL_CHECKLIST, BABY_CHECKLIST } from "./checklistData";
import UsePrenatalList from "./UsePrenatalList";

// --- CheckItem ---
const CheckItem = ({ check, onToggle }) => {
  // 완료 상태에 따라 다른 CSS 클래스 적용
  const checkCircleClass = check.isDone
    ? styles.checkDone // 완료된 상태 (색상 채워짐)
    : styles.checkPending; // 미완료 상태 (테두리만 있음)

  return (
    <motion.div
      className={styles.checkItem}
      // Framer Motion: 항목 로드 시 왼쪽에서 부드럽게 나타나는 애니메이션 효과 적용
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.checkRow}>
        <button className={checkCircleClass} onClick={() => onToggle(check)} />
        <div className={styles.checkContent}>
          <b className={styles.checkTitle}>{check.title}</b>
          <div className={styles.checkDate}>
            {check.date}
            {check.is_checked === "Y" && "  (예약 일정)"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- WeekSection ---
const WeekSection = ({ data, onToggle, isSpecialWeek }) => {
  // isSpecialWeek (가장 최근/현재 주차) 여부에 따라 스타일 클래스 결정
  const containerClass = isSpecialWeek
    ? styles.activeSection // 활성 섹션: 노란색 배경 및 테두리로 강조
    : styles.defaultSection; // 일반 섹션
  const lineDotClass = isSpecialWeek
    ? styles.activeDotLine // 활성 섹션 라인 도트
    : styles.defaultDotLine; // 일반 섹션 라인 도트

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
    >
      <div className={styles.sectionInner}>
        <div className={containerClass}>
          {/* 주차 라인의 도트와 연결선 */}
          <div className={`${styles.leftLine} ${lineDotClass}`} />
          <div className={styles.sectionContent}>
            {/* 주차/월령 타이틀 (노란색 배경) */}
            <div className={styles.weekHeader}>
              <div className={styles.weekWrapper}>
                <b className={styles.weekTitle}>{data.week}</b>
              </div>
            </div>

            <div className={styles.checkList}>
              {data.checks.map((check) => (
                <CheckItem key={check.id} check={check} onToggle={onToggle} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PrenatalList ---
const PrenatalList = ({ babyData }) => {
  const isInfant = babyData?.status === "infant";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [checkClicked, setCheckClicked] = useState(false);

  const checklistInitial = useMemo(() => {
    return isInfant ? BABY_CHECKLIST : FETAL_CHECKLIST;
  }, [isInfant]);

  const { data, setData, handelChange, dataInsert, dataDelect, selectList } =
    UsePrenatalList(
      setChecklist,
      setIsModalOpen,
      setCheckClicked,
      selectedCheck
    );

  useEffect(() => {
    if (!babyData) return;

    const init = checklistInitial.map((section) => ({
      ...section,
      checks: section.checks.map((ch) => ({
        ...ch,
        isDone: false,
      })),
    }));

    setChecklist(init);
  }, [babyData, checklistInitial]);

  useEffect(() => {
    if (checklist.length > 0) {
      selectList();
    }
  }, [checklist.length]);
  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckClicked(false);
    setSelectedCheck(null);
    setData((prev) => ({
      ...prev,
      test_code: "",
      is_checked: "",
      created_at: "",
    }));
  };

  // 완료 버튼
  const handleComplete = () => {
    dataInsert(selectedCheck.id, () => {
      setChecklist((prev) =>
        prev.map((section) => ({
          ...section,
          checks: section.checks.map((c) =>
            c.id === selectedCheck.id ? { ...c, isDone: true } : c
          ),
        }))
      );
      handleCloseModal();
    });
  };

  // 체크 버튼 클릭
  const handleToggleCheck = (check) => {
    if (!check.isDone) {
      setSelectedCheck(check);
      setIsModalOpen(true);
      setCheckClicked(false);

      setData((prev) => ({
        ...prev,
        test_code: check.id,
        is_checked: "N",
        created_at: "",
      }));
    } else {
      dataDelect(check.id);
      setChecklist((prev) =>
        prev.map((section) => ({
          ...section,
          checks: section.checks.map((c) =>
            c.id === check.id ? { ...c, isDone: false } : c
          ),
        }))
      );
    }
  };

  if (!babyData) return null;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.lineContainer}>
          <div className={styles.verticalLine} />
        </div>

        <div className={styles.sectionsWrapper}>
          {checklist.map((section, index) => (
            <WeekSection
              key={section.id}
              data={section}
              isSpecialWeek={index === 0}
              onToggle={handleToggleCheck}
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedCheck && (
        <div className={styles.modalOverlay}>
          <div className={styles.innerWrapper}>
            <div className={styles.modalContent}>
              <div className={styles.headerSection}>
                <h1 className={styles.title}>{selectedCheck.title}</h1>
                <p className={styles.subtitle}>예약 날짜를 작성해주세요</p>
              </div>

              <div className={styles.formSection}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>예약 날짜</label>
                  <div className={styles.row}>
                    <input
                      type="date"
                      name="date"
                      value={data.created_at} 
                      onChange={handelChange}
                      min={
                        checkClicked
                          ? new Date().toISOString().split("T")[0]
                          : undefined
                      }
                      className={styles.inputBox}
                    />
                  </div>

                  <div
                    className={styles.row}
                    style={{ marginTop: "10px", gap: "20px" }}
                  >
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="checkbox"
                        checked={data.is_checked === "Y"}
                        onChange={handelChange}
                      />{" "}
                      일정 예약
                    </label>
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button className={styles.backBtn} onClick={handleCloseModal}>
                    뒤로가기
                  </button>
                  <button className={styles.submitBtn} onClick={handleComplete}>
                    완료
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrenatalList;
