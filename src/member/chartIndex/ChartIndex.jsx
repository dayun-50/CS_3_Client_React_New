import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import TotalChart from "./totalChart/TotalChart";
import DetailChart from "./detailChart/DetailChart";
import ChartInput from "./chartInput/ChartInput";
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
  const [actualData, setActualData] = useState({});
  const [currentWeek, setCurrentWeek] = useState(0);
  const [activeMenu, setActiveMenu] = useState(0);
  const { babyDueDate } = useAuthStore((state) => state);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
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
  const currentMenuList = isFetalMode ? fetalMenuList : infantMenuList;
  const currentStandardData = useMemo(() => {
    if (currentWeek <= 0) return null;

    if (isFetalMode) {

      return FETAL_STANDARDS[currentWeek];
    }
    return INFANT_STANDARDS[Math.ceil(currentWeek / 4)];

  }, [currentWeek, isFetalMode]);



  const { babySeq, babyInfo, menuList } = useChartIndex(
    currentWeek,
    setCurrentWeek
  );

  const fetchActualData = async () => {

    setActualData(null);


    try {
      const { babySeq, status, birthDate } = babyInfo;
      const week = currentWeek;
      const month = Math.ceil(currentWeek / 4);
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

      const mappedInputs = isFetalMode ? {
        "몸무게": actualData.EFW ? String(actualData.EFW / 1000) : "",
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

    }
  }, [actualData]);


  const isLoading = actualData === null || currentStandardData === undefined;

  if (currentWeek === 0 || isLoading) {
    return <Loading message="데이터를 준비하고 있습니다" />;
  }

  return (
    <div className={styles.body}>

      <div className={styles.menuSection}>
        {currentMenuList.map((item, idx) => (
          <button
            key={idx}
            className={

              idx === activeMenu ? styles.menuActive : styles.menuButton
            }
            onClick={() => {
              setActiveMenu(idx);

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
                isFetalMode={isFetalMode}
                inputs={inputs}

              />
            ) : (

              <DetailChart
                menuList={currentMenuList}
                activeMenu={activeMenu}
                currentWeek={currentWeek}
                actualData={actualData}
                standardData={currentStandardData}
                isFetalMode={isFetalMode}

              />
            )
          }


        </div>


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
