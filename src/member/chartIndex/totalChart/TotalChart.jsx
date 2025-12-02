import {useState, useEffect, React } from "react";
import styles from "./TotalChart.module.css";
import { UseTotalChart } from "./UseTotalChart";
import ReactECharts from 'echarts-for-react';

// TotalChart는 ChartIndex로부터 메뉴 리스트와 활성 상태를 props로 받음
const TotalChart = ({ menuList, activeMenu, currentWeek, standardData, actualData ,inputs }) => {
  // 2. [Default] activeMenu가 0일 경우, ECharts 옵션 생성 및 차트 렌더링을 진행합니다.

  //  로직 파일에서 옵션을 가져옵니다.
  const option = UseTotalChart(currentWeek, standardData, actualData, inputs || {});  
  console.log("주차 불러오기", currentWeek);
  
  const [reset, setReset] = useState(true);

useEffect(() => {
  setReset(false);
  const timer = setTimeout(() => setReset(true), 0);  // 바로 리마운트
  return () => clearTimeout(timer);
}, [actualData]);




  if (!currentWeek > 0) {
    return (
      <div className={styles.loading}>데이터를 계산하고 로딩 중입니다...</div>
    );
  }

  return (
    <div className={styles.contentBox}>
      {/* 실제 차트 들어가는 자리 */}
      <div className={styles.chartArea}>
        {reset &&( 
          <ReactECharts
          option={option} // 가공된 옵션을 바로 사용
          style={{ height: '100%', width: '100%' }}
        />)}
      </div>
    </div>
  );
};

export default TotalChart;