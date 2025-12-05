import { useState, useEffect } from "react";
import styles from "./TotalChart.module.css";
import { UseTotalChart } from "./UseTotalChart";
import ReactECharts from "echarts-for-react";

// TotalChart는 ChartIndex로부터 메뉴 리스트와 활성 상태를 props로 받음
const TotalChart = ({ currentWeek, standardData, actualData, setActualData, isFetalMode, inputs }) => {
  // 2. [Default] activeMenu가 0일 경우, ECharts 옵션 생성 및 차트 렌더링을 진행합니다.

  //  로직 파일에서 옵션을 가져옵니다.
  const option = UseTotalChart(currentWeek, standardData, actualData, inputs || {}, isFetalMode);
  console.log("주차 불러오기", currentWeek);

  const [reset, setReset] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 반응형을 위한 로직

  useEffect(() => {
    setReset(false);
    const timer = setTimeout(() => setReset(true), 0);  // 바로 리마운트
    return () => clearTimeout(timer);
  }, [actualData]);

  // 반응형 적용 css
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 화면 너비에 따른 폰트/선 굵기 설정
  let fontSize = 16;
  let lineWidth = 3;

  if (windowWidth <= 1024) {
    fontSize = 14;
    lineWidth = 2;
  }
  if (windowWidth <= 768) {
    fontSize = 12;
    lineWidth = 2;
  }
  if (windowWidth <= 480) {
    fontSize = 10;
    lineWidth = 1;
  }

  if (!currentWeek || !standardData) {
    return (
      <div className={styles.loading}>데이터를 계산하고 로딩 중입니다</div>
    );
  }

  return (
    <div className={styles.contentBox}>
      <div className={styles.chartArea}>
        {reset && (
          <ReactECharts
            option={option}
            style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          />
        )}
      </div>
    </div>
  );
};

export default TotalChart;
