import React from "react";
import styles from "./TotalChart.module.css";
import { UseTotalChart } from "./UseTotalChart";
import ReactECharts from 'echarts-for-react';

// TotalChart는 ChartIndex로부터 메뉴 리스트와 활성 상태를 props로 받음
const TotalChart = ({ menuList, activeMenu, currentWeek, standardData, actualData }) => {
  // 2. [Default] activeMenu가 0일 경우, ECharts 옵션 생성 및 차트 렌더링을 진행합니다.

  //  로직 파일에서 옵션을 가져옵니다.
  const option = UseTotalChart(currentWeek, standardData, actualData);
  return (
    <div className={styles.contentBox}>
      {/* 실제 차트 들어가는 자리 */}
      <div className={styles.chartArea}>
        <ReactECharts
          option={option} // 가공된 옵션을 바로 사용
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default TotalChart;