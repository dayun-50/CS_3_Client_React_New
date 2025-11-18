import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import TotalChart from "./totalChart/TotalChart";
import DetailChart from "./detailChart/DetailChart";
import ChartInput from "./chartInput/ChartInput"; // 오른쪽 입력 폼 컴포넌트
import styles from "./ChartIndex.module.css";

const ChartIndex = () => {
  // 상단 메뉴튼버튼
  const menuList = [
    "전체",
    "몸무게",
    "머리직경",
    "머리둘레",
    "복부둘레",
    "허벅지 길이",
  ];

  const [activeMenu, setActiveMenu] = useState(0);

  return (
    <div className={styles.body}>
      {/* 상단 버튼 영역 */}
      <div className={styles.menuSection}>
        {menuList.map((item, idx) => (
          <button
            key={idx}
            className={
              idx === activeMenu ? styles.menuActive : styles.menuButton
            }
            onClick={() => setActiveMenu(idx)} // 클릭 이벤트 추가
          >
            {item}
          </button>
        ))}
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className={styles.contentWrapper}>
        <div className={styles.chartRouteArea}>
          <Routes>
            {/* TotalChart와 DetailChart에 필요한 데이터를 props로 전달 */}
            <Route
              path=""
              element={
                <TotalChart menuList={menuList} activeMenu={activeMenu} />
              }
            />
            <Route
              path="detail"
              element={
                <DetailChart menuList={menuList} activeMenu={activeMenu} />
              }
            />
          </Routes>
        </div>

        {/* 입력폼 */}
        <ChartInput menuList={menuList} activeMenu={activeMenu} />
      </div>
    </div>
  );
};
export default ChartIndex;
