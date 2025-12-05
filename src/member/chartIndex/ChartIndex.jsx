import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import TotalChart from "./totalChart/TotalChart";
import DetailChart from "./detailChart/DetailChart";
import ChartInput from "./chartInput/ChartInput"; // 오른쪽 입력 폼 컴포넌트
import styles from "./ChartIndex.module.css";
import { FETAL_STANDARDS } from "./FetalStandardData";
import { caxios } from "../../config/config";
import Loading from "common/loading/Loading";

import useAuthStore from "../../store/useStore";
import { useChartIndex } from "./UseChartIndex";
import { fetalWeekStartEnd, infantMonthStartEnd, } from "../utils/pregnancyUtils";
import { INFANT_STANDARDS } from "./InfantStandardData";
const ChartIndex = () => {
  const [inputs, setInputs] = useState({});
  const [actualData, setActualData] = useState({}); // 실제 입력 데이터 (API 응답)
  const [currentWeek, setCurrentWeek] = useState(0); // 현재 주차 상태
  const [activeMenu, setActiveMenu] = useState(0); // 활성 메뉴 인덱스
  const { babyDueDate } = useAuthStore((state) => state);
  const today = new Date().toISOString().split("T")[0];
  const isFetalMode = babyDueDate > today;
  const measureTypes = isFetalMode ? {
    EFW: inputs["몸무게"],
    OFD: inputs["머리직경"],
    HC: inputs["머리둘레"],
    AC: inputs["복부둘레"],
    FL: inputs["허벅지 길이"],
  }
    : {
      BW: inputs["몸무게"],
      HT: inputs["신장"],
      HC: inputs["머리둘레"],
    };

  const fetalMenuList = [
    "성장",
    "몸무게",
    "머리직경",
    "머리둘레",
    "복부둘레",
    "허벅지 길이",
  ];
  const infantMenuList = ["성장", "몸무게", "머리둘레", "신장"];

  // 현재 모드에 따라 사용될 메뉴 리스트를 동적으로 결정
  const currentMenuList = isFetalMode ? fetalMenuList : infantMenuList;

  // 정적 표준 데이터 계산
  const currentStandardData = useMemo(() => {
    // 임산모 모드일 때만 FETAL_STANDARDS를 사용하고, 육아 모드일 때는 다른 표준을 사용하거나 (추가 로직 필요) undefined를 반환할 수 있습니다.
    // 여기서는 기존 로직대로 임산모 모드의 데이터만 유지합니다.
    if (currentWeek <= 0) return null;
    console.log("신생아 데이터", FETAL_STANDARDS[currentWeek]);
    console.log("영유아 데이터", INFANT_STANDARDS[Math.floor(currentWeek / 4)]);
    console.log("currentWeek", currentWeek);
    console.log("currentMonth", Math.floor(currentWeek / 4));
    console.log("isFetalMode : ", isFetalMode);
    if (isFetalMode) {

      return FETAL_STANDARDS[currentWeek];
    }
    return INFANT_STANDARDS[Math.floor(currentWeek / 4)];

  }, [currentWeek, isFetalMode]); // isFetalMode가 바뀔 때 useMemo 재계산

  console.log("메뉴 : " + activeMenu);
  console.log("DEBUG — currentWeek:", currentWeek);
  console.log("DEBUG — currentStandardData:", currentStandardData);
  console.log("DEBUG — actualData:", actualData);

  const { babySeq, babyInfo, menuList } = useChartIndex(
    currentWeek,
    setCurrentWeek
  );

  const fetchActualData = async () => {

    setActualData(null); // 로딩 시작


    try {
      const { babySeq, status, birthDate } = babyInfo;
      const week = currentWeek;
      const month = Math.floor(currentWeek / 4);
      let startDate, endDate;
      if (status.toLowerCase() === "fetus") {
        [startDate, endDate] = fetalWeekStartEnd(birthDate, week);
      } else {
        [startDate, endDate] = infantMonthStartEnd(birthDate, month);
      }

      const response = await caxios.get(`/chart/total`, {
        params: { babyId: babySeq, week, startDate, endDate },
      });

      setActualData(response.data || {});
      console.log(" Actual Data 로딩 완료:", response.data);

    } catch (error) {
      console.error("Actual Data 조회 실패:", error);
      setActualData({});
    }
  };
  useEffect(() => {
    if (babyInfo) fetchActualData();
  }, [babyInfo, currentWeek, isFetalMode]);

  useEffect(() => {
    if (actualData && Object.keys(actualData).length > 0) {
      // actualData의 key를 inputs key로 매핑
      const mappedInputs = isFetalMode ? {
        "몸무게": actualData.EFW ?? "",
        "머리직경": actualData.OFD ?? "",
        "머리둘레": actualData.HC ?? "",
        "복부둘레": actualData.AC ?? "",
        "허벅지 길이": actualData.FL ?? "",
      } :
        {
          "몸무게": actualData.BW ?? "",
          "신장": actualData.HT ?? "",
          "머리둘레": actualData.HC ?? "",
        };

      setInputs(mappedInputs);
      console.log(" inputs 세팅 완료:", mappedInputs);
    }
  }, [actualData]);

  // 로딩 상태 처리

  const isLoading = actualData === null || currentStandardData === undefined;

  if (currentWeek === 0 || isLoading) {
    return <Loading message="데이터를 준비하고 있습니다" />;
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

      <div className={styles.contentWrapper}>
        <div className={styles.chartRouteArea} >
          {
            activeMenu === 0 ? (
              <TotalChart
                currentWeek={currentWeek}
                standardData={currentStandardData}
                actualData={actualData}
                setActualData={setActualData}
                isFetalMode={isFetalMode} // 모드 전달
                inputs={inputs}

              />
            ) : (
              // activeMenu가 1 이상일 때 DetailChart가 렌더
              <DetailChart
                menuList={currentMenuList} // 수정된 리스트 전달
                activeMenu={activeMenu}
                currentWeek={currentWeek}
                actualData={actualData}
                standardData={currentStandardData}
                isFetalMode={isFetalMode} // 모드 전달
              //babyInfo={babyInfo}

              />
            )
          }


        </div>

        {/* 입력폼 */}
        {actualData && (
          <ChartInput
            menuList={currentMenuList}
            activeMenu={activeMenu}
            currentWeek={currentWeek}
            isFetalMode={isFetalMode}
            inputs={inputs}
            setInputs={setInputs}
            actualData={actualData}
            setActualData={setActualData}
            fetchActualData={fetchActualData}
            measureTypes={measureTypes}
          />
        )}
      </div>
    </div >
  );
};
export default ChartIndex;
