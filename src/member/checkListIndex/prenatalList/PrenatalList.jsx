import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./PrenatalList.module.css";
import { FETAL_CHECKLIST, BABY_CHECKLIST } from "./checklistData";
import UsePrenatalList from "./UsePrenatalList";

const CheckItem = ({ check, onToggle }) => {
  const checkCircleClass = check.isDone
    ? styles.checkDone
    : styles.checkPending;

  return (
    <motion.div
      className={styles.checkItem}
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

const WeekSection = ({ data, onToggle, isSpecialWeek }) => {
  const containerClass = isSpecialWeek
    ? styles.activeSection
    : styles.defaultSection;
  const lineDotClass = isSpecialWeek
    ? styles.activeDotLine
    : styles.defaultDotLine;

  return (
    <div className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={containerClass}>
          <div className={`${styles.leftLine} ${lineDotClass}`} />
          <div className={styles.sectionContent}>
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
    </div>
  );
};

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
