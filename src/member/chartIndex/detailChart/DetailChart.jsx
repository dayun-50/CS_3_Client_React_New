import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import styles from "./DetailChart.module.css";
import { UseDetailChart } from "./UseDetailChart";
import useAuthStore from "../../../store/useStore";

const DetailChart = ({ menuList, activeMenu, currentWeek, actualData, standardData, isFetalMode }) => {


  const [option, setOption] = useState({});
  const babySeq = useAuthStore(state => state.babySeq);
  const babyDueDate = useAuthStore(state => state.babyDueDate);


  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // css


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    if (!babySeq || !babyDueDate) {

      return <div className={styles.loading}>차트를 로딩 중입니다...</div>;
    }


    UseDetailChart(
      activeMenu,
      currentWeek,
      menuList,
      standardData,
      babySeq,
      babyDueDate
      , isFetalMode
    )
      .then((resOption) => {
        setOption(resOption);
      })
      .catch((error) => {
        console.error("Detail Chart 로딩 중 오류 발생:", error);
        setOption({});
      });

  }, [activeMenu, currentWeek, menuList, standardData, babySeq, babyDueDate, isFetalMode]);


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

        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        />
      </div>
    </div>
  );
};

export default DetailChart;

