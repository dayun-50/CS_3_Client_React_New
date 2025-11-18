import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styles from "./DetailChart.module.css";

//디테일 차트 인덱스 "/chart/detail" 여기까지 라우팅
const DetailChart = ({ menuList, activeMenu }) => {
  return (
    <div className={styles.body}>
      {/* 실제 차트 들어가는 자리 */}
      <div className={styles.chartArea}>
        {menuList[activeMenu]} 차트 표시 영역
      </div>
    </div>
  );
};
export default DetailChart;
