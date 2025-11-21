import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import TotalChart from "./totalChart/TotalChart";
import DetailChart from "./detailChart/DetailChart";
import ChartInput from "./chartInput/ChartInput"; // 오른쪽 입력 폼 컴포넌트
import styles from "./ChartIndex.module.css";
import { FETAL_STANDARDS } from "./FetalStandardData";
import { caxios } from "../../config/config";

const ChartIndex = () => {
  // 상단 메뉴 버튼: 임산모
  const fetalMenuList = [
    "성장",
    "몸무게",
    "머리직경",
    "머리둘레",
    "복부둘레",
    "허벅지 길이",
  ];

  // 상단 메뉴 버튼: 육아
  const babyMenuList = ["성장", "몸무게", "키"];

  // true: 임산모/태아, false: 육아
  const [isFetalMode, setIsFetalMode] = useState(true);

  const [currentWeek, setCurrentWeek] = useState(14); // 현재 주차 상태
  const [activeMenu, setActiveMenu] = useState(0); // 활성 메뉴 인덱스

  const [actualData, setActualData] = useState(null); // 실제 입력 데이터 (API 응답)

  // 현재 모드에 따라 사용될 메뉴 리스트를 동적으로 결정
  const currentMenuList = isFetalMode ? fetalMenuList : babyMenuList;

  // 정적 표준 데이터 계산
  const currentStandardData = useMemo(() => {
    // 임산모 모드일 때만 FETAL_STANDARDS를 사용하고, 육아 모드일 때는 다른 표준을 사용하거나 (추가 로직 필요) undefined를 반환할 수 있습니다.
    // 여기서는 기존 로직대로 임산모 모드의 데이터만 유지합니다.
    if (isFetalMode) {
      return FETAL_STANDARDS[currentWeek];
    }
    return null; // 육아 모드일 때는 태아 표준 데이터는 사용하지 않음
  }, [currentWeek, isFetalMode]); // isFetalMode가 바뀔 때 useMemo 재계산

  console.log(activeMenu);

  // 데이터 조회 비동기 로직 (caxios 사용)
  //육아 모드 시 API 엔드포인트와 파라미터(week 대신 month 등)가 달짐
  useEffect(() => {
    // 육아 모드일 때는 다른 API를 호출하거나 이 효과 건너뜀
    if (!isFetalMode) {
      setActualData({}); // 육아 데이터는 다른 곳에서 가져온다고 가정
      return;
    }

    const fetchCurrentData = async () => {
      setActualData(null); // 데이터 로딩 시작

      try {
        const response = await caxios.get(`/api/fetal/measurement/current`, {
          params: {
            babyId: 1, // 실제 아기 ID로 대체
            week: currentWeek,
          },
        });

        const data = response.data;

        if (!data || Object.keys(data).length === 0) {
          setActualData({});
          return;
        }

        setActualData(data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setActualData({});
        } else {
          console.error("데이터 조회 오류:", error);
          setActualData({});
        }
      }
    };

    fetchCurrentData();
  }, [currentWeek, isFetalMode]); // currentWeek 또는 isFetalMode가 바뀔 때 실행

  // 로딩 상태 처리
  // 임산모 모드에서만 standardData의 유효성을 검사
  const isLoading =
    actualData === null || (isFetalMode && !currentStandardData);

  if (currentWeek === 0 || isLoading) {
    return (
      <div className={styles.loading}>데이터를 계산하고 로딩 중입니다...</div>
    );
  }

  return (
    <div className={styles.body}>
      {/* 상단 버튼 영역: currentMenuList를 사용하도록 수정 */}
      <div className={styles.menuSection}>
        {currentMenuList.map((item, idx) => (
          <button
            key={idx}
            className={
              // 활성 메뉴 인덱스를 currentMenuList의 길이를 벗어나지 않도록 조정 필요
              idx === activeMenu ? styles.menuActive : styles.menuButton
            }
            onClick={() => {
              setActiveMenu(idx); // 클릭 이벤트 추가
              // 메뉴가 전환되면 activeMenu를 0으로 리셋하는 로직을 isFetalMode 변경 시 추가
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className={styles.contentWrapper}>
        <div className={styles.chartRouteArea}>
          <Routes>
            <Route
              path="/"
              element={
                // activeMenu 값에 따라 TotalChart와 DetailChart 중 하나만 렌더링
                activeMenu === 0 ? (
                  <TotalChart
                    menuList={currentMenuList} // 수정된 리스트 전달
                    activeMenu={activeMenu}
                    currentWeek={currentWeek}
                    standardData={currentStandardData}
                    actualData={actualData}
                    isFetalMode={isFetalMode} // 모드 전달
                  />
                ) : (
                  // activeMenu가 1 이상일 때 DetailChart가 렌더
                  <DetailChart
                    menuList={currentMenuList} // 수정된 리스트 전달
                    activeMenu={activeMenu}
                    currentWeek={currentWeek}
                    standardData={currentStandardData}
                    actualData={actualData}
                    isFetalMode={isFetalMode} // 모드 전달
                  />
                )
              }
            />
          </Routes>
        </div>

        {/* 입력폼 */}
        <ChartInput
          menuList={currentMenuList}
          activeMenu={activeMenu}
          isFetalMode={isFetalMode}
        />
      </div>
    </div>
  );
};
export default ChartIndex;

// const ChartIndex = () => {
//   // 2.  Hook을 호출하여 모든 상태와 데이터를 가져옵니다.
//   const {
//     menuList,
//     currentWeek,
//     activeMenu,
//     setActiveMenu,
//     currentStandardData,
//     currentActualData: actualData,
//   } = useChartIndex();

//   // 3.  로딩 상태 처리
//   if (currentWeek === 0 || actualData === null || !currentStandardData) {
//     return <div className={styles.loading}>데이터를 계산하고 로딩 중입니다...</div>;
//   }

//   return (
//     <div className={styles.body}>
//       {/* 상단 버튼 영역 */}
//       <div className={styles.menuSection}>
//         {menuList.map((item, idx) => (
//           <button
//             key={idx}
//             className={
//               idx === activeMenu ? styles.menuActive : styles.menuButton
//             }
//             onClick={() => setActiveMenu(idx)} // 클릭 이벤트 추가
//           >
//             {item}
//           </button>
//         ))}
//       </div>

//       {/* 메인 컨텐츠 영역 */}
//       <div className={styles.contentWrapper}>
//         <div className={styles.chartRouteArea}>
//           <Routes>
//             {/* TotalChart와 DetailChart에 필요한 데이터를 props로 전달 */}
//             <Route
//               path="/" // URL은 고정됩니다.
//               element={
//                 //  activeMenu 값에 따라 TotalChart와 DetailChart 중 하나만 렌더링됩니다.
//                 activeMenu === 0 ? (
//                   <TotalChart
//                     menuList={menuList} activeMenu={activeMenu}
//                     currentWeek={currentWeek}
//                     standardData={currentStandardData}
//                     actualData={actualData}
//                   />
//                 ) : (
//                   // activeMenu가 1 이상일 때 DetailChart가 렌더링됩니다.
//                   <DetailChart menuList={menuList} activeMenu={activeMenu}
//                     currentWeek={currentWeek}
//                     standardData={currentStandardData}
//                     actualData={actualData}
//                   />
//                 )
//               }
//             />
//           </Routes>
//         </div>

//         {/* 입력폼 */}
//         <ChartInput menuList={menuList} activeMenu={activeMenu} />
//       </div>
//     </div>
//   );
// };
// export default ChartIndex;
