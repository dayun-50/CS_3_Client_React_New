import React, { useEffect, useState } from "react";
import styles from "./ChartInput.module.css";
import { submitChartData, updateChartData } from "./UseChartInput"; // JS 분
import useAuthStore from "../../../store/useStore";
import { FETAL_STANDARDS } from "../FetalStandardData";
import { fetalWeekStartEnd } from "member/utils/pregnancyUtils";
const ChartInput = ({ menuList, activeMenu, currentWeek, isFetalMode, inputs, setInputs, actualData, setActualData, fetchActualData, measureTypes }) => {
  const activeItem = menuList[activeMenu];
  const { id, babySeq, babyDueDate } = useAuthStore(state => state);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState("");
  const hasData = actualData && Object.keys(actualData).length > 0;
  const isDisabled = hasData && !isEditing;
  const [weekStart, setWeekStart] = useState(null);
  const [weekEnd, setWeekEnd] = useState(null);

  // 입력값 업데이트
  const map = {
    EFW: "몸무게",
    OFD: "머리직경",
    HC: "머리둘레",
    AC: "복부둘레",
    FL: "허벅지 길이",
  };


  const handleChange = (key, value) => {
    const type = Object.keys(map).find(t => map[t] === key); // EFW, HC 등
    const maxForWeek = FETAL_STANDARDS[currentWeek]?.[type]?.max;

    if (maxForWeek && Number(value) > maxForWeek) {
      alert(`${key}는 최대 ${maxForWeek}${FETAL_STANDARDS[currentWeek][type].unit}를 초과할 수 없습니다.`);
      return;
    }
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const REQUIRED_KEYS = [
    "몸무게",
    "머리직경",
    "머리둘레",
    "복부둘레",
    "허벅지 길이"
  ];




  const handleSubmit = async () => {


    //날짜 검사
    if (!date || date.trim() === "") {
      alert("날짜를 입력해주세요.");
      return;
    }
    const invalidInput = REQUIRED_KEYS.some((key) => {
      const value = inputs[key];
      // 필수 키가 inputs에 없거나 (undefined), 값이 없거나, 숫자가 아니거나, 0 이하인 경우
      return (
        value === undefined ||             // 👈 inputs에 키 자체가 없는 경우 (허벅지 둘레 미입력 시)
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


    //서버 전송
    await submitChartData({ inputs, date, babySeq, id, measureTypes });
    setIsEditing(false); // 입력 잠금, 수정 버튼 활성화
    await fetchActualData(); // 그래프 업데이트용

  }


  const handleEdit = () => setIsEditing(true);

  const handleCancelOrUpdate = async (action) => {
    if (action === "cancel") {
      const restoredInputs = {};
      Object.entries(actualData).forEach(([type, value]) => {
        const key = map[type];
        if (!key) return;
        restoredInputs[key] = type === "EFW" ? String(value / 1000) : String(value);
      });
      setInputs(restoredInputs);
      setIsEditing(false);
      return;
    }
    else if (action === "update") {
      // 수정 완료 → 서버 전송
      const invalidInput = REQUIRED_KEYS.some((key) => {
        const value = inputs[key];
        return value === undefined || value === null || value === "" || isNaN(Number(value)) || Number(value) <= 0;
      });

      if (invalidInput) {
        alert("모든 필수 항목을 올바르게 입력해주세요.");
        return;
      }



      await updateChartData({ inputs, date, babySeq, id, actualData });
      setIsEditing(false);
      await fetchActualData();
    }



  }

  useEffect(() => {
    if (!babyDueDate || babyDueDate === 0) {
      console.log("babyDueDate 아직 없음:", babyDueDate);
      return;
    }


    const [start, end] = fetalWeekStartEnd(babyDueDate, currentWeek);
    setWeekStart(start);
    setWeekEnd(end);
    console.log("weekStart / weekEnd:", start, end);

    //  actualData가 있으면 입력값 업데이트
    if (actualData && Object.keys(actualData).length > 0) {
      console.log("Actual Data:", actualData);

      // measure_date 처리
      if (actualData.measure_date) {
        const formattedDate = new Date(actualData.measure_date)
          .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
        setDate(formattedDate);
      } else {
        setDate(prev => prev || weekStart || "");
      }

      // 입력값 매핑
      const updatedInputs = {};
      Object.entries(actualData).forEach(([type, value]) => {
        const key = map[type];
        if (!key) return;

        updatedInputs[key] = type === "EFW" ? String(value / 1000) : String(value);
      });
      setInputs(updatedInputs);

      setIsEditing(false); // 완료 후 자동으로 수정 버튼 활성화
    }
  }, [babyDueDate, currentWeek, actualData]);



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
                      // value={actualData[item] ?? ""}
                      value={inputs[item] ?? ""}
                      disabled={isDisabled}
                      onChange={(e) => handleChange(item, e.target.value)}
                      placeholder={item}
                    />
                    <span className={styles.unit}>kg</span>
                  </div>// 잠시 kg -> g으로 바꿔서 사용 >> 나중에 다바꿔야해서 편의상 g 사용해야할거같음
                ) : (
                  <div className={styles.inputWithUnit}>
                    <input
                      className={styles.input}
                      type="number"
                      // value={actualData[item] ?? ""}
                      value={inputs[item] ?? ""}
                      disabled={isDisabled}
                      onChange={(e) => handleChange(item, e.target.value)}
                      placeholder={item}
                    />
                    <span className={styles.unit}>mm</span>
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
                <span className={styles.unit}>mm</span>
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
            <button className={styles.submitBtn} onClick={handleEdit}>
              수정
            </button>
          )
        }
      </div >
    </div >
  );
};

export default ChartInput;
