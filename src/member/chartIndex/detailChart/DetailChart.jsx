import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import styles from "./DetailChart.module.css";
import { UseDetailChart } from "./UseDetailChart";
import useAuthStore from "../../../store/useStore";

const DetailChart = ({ menuList, activeMenu, currentWeek, actualData, standardData, isFetalMode }) => {


  const [option, setOption] = useState({});
  const babySeq = useAuthStore(state => state.babySeq);
  const babyDueDate = useAuthStore(state => state.babyDueDate);

  console.log("DetailChart Props:", {
    menuList,
    activeMenu,
    currentWeek,
    standardData,
    actualData,
    babySeq,
    babyDueDate,
    isFetalMode
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // css

  // 반응형
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 유효성 검사: API 호출 차단 방지 (babySeq와 dueDate 둘 다 필요)
    if (!babySeq || !babyDueDate) {
      // console.warn(
      //   "DetailChart: 필수 인자 (babySeq 또는 dueDate) 누락으로 차트 로드 중단."
      // );
      // setOption({});
      // return;
      return <div className={styles.loading}>차트를 로딩 중입니다...</div>;
    }

    // 비동기 함수 호출
    UseDetailChart(
      activeMenu,
      currentWeek,
      menuList,
      standardData,
      babySeq,
      babyDueDate
    )
      .then((resOption) => {
        console.log("그래프 옵션 생성 완료 (Detail):", resOption);
        setOption(resOption);
      })
      .catch((error) => {
        console.error("Detail Chart 로딩 중 오류 발생:", error);
        setOption({});
      });
    // 의존성 배열에 획득한 값들을 모두 포함
  }, [activeMenu, currentWeek, menuList, standardData, babySeq, babyDueDate, isFetalMode]);

  //반응형 + css
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

  return (

    <div className={styles.contentBox}>
      <div className={styles.chartArea}>
        {/* 3. ReactECharts를 사용하여 꺾은선 그래프 렌더링 */}
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        />
      </div>
    </div>
  );
};

export default DetailChart;

