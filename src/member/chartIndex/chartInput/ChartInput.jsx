import React, { useEffect, useState } from "react";
import styles from "./ChartInput.module.css";
import { submitChartData, updateChartData } from "./UseChartInput"; // JS 분
import useAuthStore from "../../../store/useStore";
import { FETAL_STANDARDS } from "../FetalStandardData";
import { fetalWeekStartEnd, infantMonthStartEnd } from "member/utils/pregnancyUtils";
import { INFANT_STANDARDS } from "../InfantStandardData";
const ChartInput = ({ menuList, activeMenu, currentWeek, isFetalMode, inputs, setInputs, actualData, setActualData, fetchActualData, measureTypes }) => {
  const activeItem = menuList[activeMenu];
  const { id, babySeq, babyDueDate } = useAuthStore(state => state);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState("");
  const hasData = actualData && Object.keys(actualData).length > 0;
  const isDisabled = hasData && !isEditing;
  const [weekStart, setWeekStart] = useState(null);
  const [weekEnd, setWeekEnd] = useState(null);
  const [render, setRender] = useState(false);

  const map = isFetalMode ? {
    EFW: "몸무게",
    OFD: "머리직경",
    HC: "머리둘레",
    AC: "복부둘레",
    FL: "허벅지 길이",
  } : {
    BW: "몸무게",
    HC: "머리둘레",
    HT: "신장"
  };


  const handleChange = (key, value) => {
    const type = Object.keys(map).find(t => map[t] === key); // EFW, HC 등
    const standard = isFetalMode ? FETAL_STANDARDS[currentWeek]?.[type] : INFANT_STANDARDS[Math.ceil(currentWeek / 4)]?.[type];
    if (!standard) {
      setInputs(prev => ({ ...prev, [key]: value }));
      return;
    }
    const max = standard.max;
    const compareValue = type === "EFW" ? Number(value) * 1000 : Number(value);
    const maxForAlert = type === "EFW" ? max / 1000 : max;
    const weirdForAlert = (maxForAlert * 1.05).toFixed(2);
    const unitForAlert = type === "EFW" ? "kg" : standard.unit;

    if (compareValue > max * (1.05)) {
      alert(`${key}는 최대 ${weirdForAlert}${unitForAlert}를 초과할 수 없습니다.`);
      return;
    }

    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const REQUIRED_KEYS = isFetalMode ? [
    "몸무게",
    "머리직경",
    "머리둘레",
    "복부둘레",
    "허벅지 길이"
  ] : [
    "몸무게",
    "머리둘레",
    "신장"
  ];

  const isDateInRange = (selected, start, end) => {
    if (!selected) return false;
    if (start && selected < start) return false;
    if (end && selected > end) return false;
    return true;
  };

  const handleSubmit = async () => {


    //날짜 검사
    if (!date || date.trim() === "") {
      alert("날짜를 입력해주세요.");
      return;
    }
    if (!isDateInRange(date, weekStart, weekEnd)) {
      alert(`날짜는 ${weekStart} ~ ${weekEnd} 사이만 가능합니다.`);
      return;
    }


    const invalidInput = REQUIRED_KEYS.some((key) => {
      const value = inputs[key];

      return (
        value === undefined ||
        value === null ||
        value === "" ||
        isNaN(Number(value)) ||
        Number(value) <= 0
      );
    });

    if (invalidInput) {
      alert("모든 필수 항목(" + REQUIRED_KEYS.join(', ') + ")을 올바르게 입력해주세요.");
      return;
    }



    await submitChartData({ inputs, date, babySeq, id, measureTypes, actualData });
    setIsEditing(false);
    await fetchActualData();

  }



  const handleEdit = () => {
    if (actualData?.measure_date) {
      const formatted = new Date(actualData.measure_date)
        .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

      setDate(formatted);
    } else {
      setDate("");
    }

    setIsEditing(true);
  };

  const handleCancelOrUpdate = async (action) => {
    if (action === "cancel") {
      setIsEditing(false);
      setRender(prev => !prev);

      return;
    }
    else if (action === "update") {
      if (!date || date.trim() === "") {
        alert("날짜를 입력해주세요.");
        return;
      }
      if (!isDateInRange(date, weekStart, weekEnd)) {
        alert(`날짜는 ${weekStart} ~ ${weekEnd} 사이만 가능합니다.`);
        return;
      }
      const invalidInput = REQUIRED_KEYS.some((key) => {
        const value = inputs[key];
        return value === undefined || value === null || value === "" || isNaN(Number(value)) || Number(value) <= 0;
      });

      if (invalidInput) {
        alert("모든 필수 항목을 올바르게 입력해주세요.");
        return;
      }





      await updateChartData({ date, babySeq, id, measureTypes, actualData });
      setIsEditing(false);

      await fetchActualData();
    }



  }


  useEffect(() => {
    const handleGlobalKeyDown = (e) => {

      if (e.isComposing) return;

      if (e.key !== "Enter") return;

      e.preventDefault();

      if (!hasData) {
        handleSubmit();
      }
      else if (hasData && isEditing) {
        handleCancelOrUpdate("update");
      }
      else if (hasData && !isEditing) {
        handleEdit();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [hasData, isEditing, inputs, date]);



  useEffect(() => {
    if (!babyDueDate || babyDueDate === 0) {

      return;
    }

    const [start, end] = isFetalMode ? fetalWeekStartEnd(babyDueDate, currentWeek) : infantMonthStartEnd(babyDueDate, Math.ceil(currentWeek / 4));
    setWeekStart(start);
    setWeekEnd(end);


    if (isEditing) return;


    if (actualData && Object.keys(actualData).length > 0) {



      if (actualData?.measure_date) {
        const formattedDate = new Date(actualData.measure_date)
          .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        setDate(formattedDate);

      } else {
        setDate(prev => prev || weekStart || "");

      }


      const updatedInputs = {};
      Object.entries(actualData).forEach(([type, value]) => {
        const key = map[type];
        if (!key) return;


        if (isFetalMode && type === "EFW") {
          updatedInputs[key] = String(value / 1000);

        } else {
          updatedInputs[key] = String(value);
        }



      });
      setInputs(updatedInputs);

      setIsEditing(false);
    }
  }, [babyDueDate, currentWeek, actualData, render, isEditing]);



  const shouldRenderSingleInput = activeItem !== "성장";
  const isWeightInput = activeItem === "몸무게";



  return (
    <div className={styles.sidePanel}>
      <div className={styles.panelHeader}>{activeItem}</div>

      <div className={styles.panelContent}>
        <label className={styles.label}>날짜</label>
        <input
          className={styles.input}
          type="date"
          placeholder="날짜"
          value={date}
          min={weekStart ?? undefined}
          max={weekEnd ?? undefined}
          disabled={isDisabled}
          onChange={(e) => setDate(e.target.value)}
        />

        {activeItem === "성장" && (
          <div className={styles.allInputGroup}>
            {menuList.slice(1).map((item) => (
              <div key={item} className={styles.inputGroup}>
                <label className={styles.label}>{item}</label>
                {item === "몸무게" ? (
                  <div className={styles.inputWithUnit}>
                    <input
                      className={styles.input}
                      type="number"

                      value={inputs[item] ?? ""}
                      disabled={isDisabled}

                      onChange={(e) => handleChange(item, e.target.value)}
                      placeholder={item}
                    />
                    <span className={styles.unit}>kg</span>
                  </div>
                ) : (
                  <div className={styles.inputWithUnit}>
                    <input
                      className={styles.input}
                      type="number"

                      value={inputs[item] ?? ""}
                      disabled={isDisabled}

                      onChange={(e) => handleChange(item, e.target.value)}
                      placeholder={item}
                    />
                    <span className={styles.unit}>{isFetalMode ? "mm" : "cm"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {shouldRenderSingleInput && activeItem !== "성장" && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>{activeItem}</label>
            {isWeightInput ? (
              <div className={styles.inputWithUnit}>
                <input
                  className={styles.input}
                  type="number"
                  value={inputs[activeItem] ?? ""}
                  disabled={isDisabled}

                  onChange={(e) => handleChange(activeItem, e.target.value)}
                  placeholder={activeItem}
                />
                <span className={styles.unit}>kg</span>
              </div>
            ) : (
              <div className={styles.inputWithUnit}>
                <input
                  className={styles.input}
                  type="number"
                  value={inputs[activeItem] ?? ""}
                  disabled={isDisabled}

                  onChange={(e) => handleChange(activeItem, e.target.value)}
                  placeholder={activeItem}
                />
                <span className={styles.unit}>{isFetalMode ? "mm" : "cm"}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.buttonRow}>
        {!hasData && (
          <button className={styles.submitBtn} onClick={handleSubmit}>
            완료
          </button>
        )}
        {hasData && isEditing && (
          <>
            <button className={styles.cancelBtn} onClick={() => handleCancelOrUpdate("cancel")}>
              취소
            </button>
            <button className={styles.submitBtn} onClick={() => handleCancelOrUpdate("update")}>
              수정완료
            </button>
          </>
        )
        }
        {
          hasData && !isEditing && (
            <button className={styles.submitBtn} onClick={handleEdit} >
              수정
            </button>
          )
        }
      </div >
    </div >
  );
};

export default ChartInput;
