import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import TotalChart from "./totalChart/TotalChart";
import DetailChart from "./detailChart/DetailChart";
import ChartInput from "./chartInput/ChartInput"; // 오른쪽 입력 폼 컴포넌트
import styles from "./ChartIndex.module.css";
import { FETAL_STANDARDS } from "./FetalStandardData";
import { caxios } from "../../config/config";
import { useChartIndex } from "./UseChartIndex";
import useAuthStore from "../../store/useStore";


const ChartIndex = () => {
  const babySeqFromStore = useAuthStore(state => state.babySeq);

  const {
    menuList,
    currentWeek,
    activeMenu,
    setActiveMenu,
    currentStandardData,
    currentActualData: actualData,
  } = useChartIndex(babySeqFromStore);

  // // 로딩 조건
  // const isLoading =
  //   !babySeqFromStore ||
  //   currentWeek === 0 ||
  //   actualData === null ||
  //   !currentStandardData;


  return (
    <div className={styles.body}>
      <div className={styles.menuSection}>
        {menuList.map((item, idx) => (
          <button
            key={idx}
            className={idx === activeMenu ? styles.menuActive : styles.menuButton}
            onClick={() => setActiveMenu(idx)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.chartRouteArea} >
          <Routes>
            <Route
              path="/"
              element={
                activeMenu === 0 ? (
                  <TotalChart
                    menuList={menuList}
                    activeMenu={activeMenu}
                    currentWeek={currentWeek}
                    standardData={currentStandardData}
                    actualData={actualData}
                  />
                ) : (
                  <DetailChart
                    menuList={menuList}
                    activeMenu={activeMenu}
                    currentWeek={currentWeek}
                    standardData={currentStandardData}
                    actualData={actualData}
                  />
                )
              }
            />
          </Routes>
        </div>

        <ChartInput menuList={menuList} activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default ChartIndex;