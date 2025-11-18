import React from "react";
import styles from "./ChartInput.module.css";

// ChartIndex로부터 메뉴 리스트를 props로 받음
const ChartInput = ({ menuList, activeMenu }) => {
  return (
    <div className={styles.sidePanel}>
      {/* 패널 상단 제목*/}
      <div className={styles.panelHeader}>{menuList[activeMenu]} 전체</div>

      {/* 입력 필드 */}
      <div className={styles.panelContent}>
        {/* '전체' 항목을 제외하고 매핑 */}
        {menuList.slice(1).map((item) => (
          <div key={item} className={styles.inputGroup}>
            {/* 입력 라벨 */}
            <label className={styles.label}>{item}</label>

            {/* 몸무게만 단위 g 표시, 나머지는 일반 숫자 입력 */}
            {item === "몸무게" ? (
              <div className={styles.inputWithUnit}>
                <input
                  className={styles.input}
                  type="number"
                  placeholder={item}
                />
                <span className={styles.unit}>g</span>
              </div>
            ) : (
              <input
                className={styles.input}
                type="number"
                placeholder={item}
              />
            )}
          </div>
        ))}
      </div>

      {/* 버튼*/}
      <div className={styles.buttonRow}>
        <button className={styles.cancelBtn}>취소</button>
        <button className={styles.submitBtn}>완료</button>
      </div>
    </div>
  );
};
export default ChartInput;
