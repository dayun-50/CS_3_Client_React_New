import { Routes, Route, useNavigate } from "react-router-dom";
import EverydayNavi from "../everydayNavi/EverydayNavi";
import EverydayDetail from "../everydayDetail/EverydayDetail";
import EverydayWrite from "../everydayWrite/EverydayWrite";
import styles from "./BornDiaryIndex.module.css";
import { UseBornDiaryIndex } from "./UseBornDiaryIndex";

const BornDiaryIndex = ({ setIsBorn }) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    setIsBorn(false); 
    navigate('/diary');
  };


  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    avg,
    currentDate,
    setCurrentDate,
    formatDateKr,
    fetchData,
    handleSearch,
    fetchAvgData,
    setAvg
  } = UseBornDiaryIndex();



  return (
    <div className={styles.diaryIndexWrapper}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={handleNavigateBack}>
          산모수첩
        </button>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.leftPanel}>
          <EverydayNavi
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            avg={avg}
            handleSearch={handleSearch} />
        </div>

        <div className={styles.rightContent}>
          <Routes>
            <Route path="" element={
              <EverydayDetail
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                formatDateKr={formatDateKr}
                fetchData={fetchData}
                fetchAvgData={fetchAvgData}
                startDate={startDate}
                endDate={endDate}
                setAvg={setAvg}
              />} /> 
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default BornDiaryIndex;
