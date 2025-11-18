import React from "react";
import styles from "./TotalChart.module.css";

// TotalChart는 ChartIndex로부터 메뉴 리스트와 활성 상태를 props로 받음
const TotalChart = ({ menuList, activeMenu }) => {
  return (
    <div className={styles.contentBox}>
      {/* 실제 차트 들어가는 자리 */}
      <div className={styles.chartArea}>
        {menuList[activeMenu]} 차트 표시 영역
      </div>
    </div>
  );
};

export default TotalChart;
