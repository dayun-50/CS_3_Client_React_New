import { useState, useEffect } from "react";
import styles from "./TotalChart.module.css";
import { UseTotalChart } from "./UseTotalChart";
import ReactECharts from "echarts-for-react";


const TotalChart = ({ currentWeek, standardData, actualData, setActualData, isFetalMode, inputs }) => {



  const option = UseTotalChart(currentWeek, standardData, actualData, inputs || {}, isFetalMode);


  const [reset, setReset] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setReset(false);
    const timer = setTimeout(() => setReset(true), 0);
    return () => clearTimeout(timer);
  }, [actualData]);

  // 반응형 적용 css
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
