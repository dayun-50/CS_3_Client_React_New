
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styles from "./DetailChart.module.css";
import { UseDetailChart } from "./UseDetailChart";
import ReactECharts from 'echarts-for-react';
//디테일 차트 인덱스 "/chart/detail" 여기까지 라우팅
const DetailChart = ({ menuList, activeMenu, currentWeek, standardData, actualData }) => {

  // 1.  Logic File을 호출하여 옵션을 생성합니다.
  const option = UseDetailChart(activeMenu, currentWeek, menuList, standardData,
    actualData);


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

//   if (isDetailChartActive) {
//   return (
//     <div className={styles.body}>
//       {/* 실제 차트 들어가는 자리 */}
//       <div className={styles.chartArea}>
//         {menuList[activeMenu]} 차트 표시 영역
//       </div>
//     </div>
//   );
// };
export default DetailChart;
