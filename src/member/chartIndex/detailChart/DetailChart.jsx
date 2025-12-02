import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./DetailChart.module.css";
import { UseDetailChart } from "./UseDetailChart";
import ReactECharts from 'echarts-for-react';
import useAuthStore from "../../../store/useStore";
//디테일 차트 인덱스 "/chart/detail" 여기까지 라우팅
const DetailChart = ({ menuList, activeMenu, currentWeek, standardData, actualData, babyInfo }) => {

  const [option, setOption] = useState({});

  // 1. babySeq 획득 (Store 사용)
  const storedBabySeq = useAuthStore(state => state.babySeq);

  // 2. dueDate 획득 (Props 또는 babyInfo에서 추출)
  // babyInfo가 있다면, 그 안의 birthDate를 dueDate로 사용합니다.
  const dueDate = babyInfo?.birthDate;


  // 최종적으로 사용할 babySeq 값 (Props로 받지 않더라도 Store에서 가져옴)
  const finalBabySeq = babyInfo?.babySeq || storedBabySeq;

  useEffect(() => {
    // 🚨 유효성 검사: API 호출 차단 방지 (babySeq와 dueDate 둘 다 필요)
    if (!finalBabySeq || !dueDate || activeMenu === 0) {
      console.warn("DetailChart: 필수 인자 (babySeq 또는 dueDate) 누락으로 차트 로드 중단.");
      setOption({});
      return;
    }

    // 비동기 함수 호출
    UseDetailChart(activeMenu, currentWeek, menuList, standardData, finalBabySeq, dueDate)
      .then(resOption => {
        console.log("그래프 옵션 생성 완료 (Detail):", resOption);
        setOption(resOption);
      })
      .catch(error => {
        console.error("Detail Chart 로딩 중 오류 발생:", error);
        setOption({});
      });
    // 의존성 배열에 획득한 값들을 모두 포함
  }, [activeMenu, currentWeek, menuList, standardData, finalBabySeq, dueDate]);

  // 3. 렌더링
  return (

    <div className={styles.contentBox}>
      <div className={styles.chartArea}>
        {/* 3. ReactECharts를 사용하여 꺾은선 그래프 렌더링 */}
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>

  );

};

export default DetailChart;