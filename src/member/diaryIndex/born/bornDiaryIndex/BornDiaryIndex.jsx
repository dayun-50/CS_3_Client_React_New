import { Routes, Route, useNavigate } from "react-router-dom";
import EverydayNavi from "../everydayNavi/EverydayNavi";
import EverydayDetail from "../everydayDetail/EverydayDetail";
import EverydayWrite from "../everydayWrite/EverydayWrite";
import styles from "./BornDiaryIndex.module.css";
import { UseBornDiaryIndex } from "./UseBornDiaryIndex";

//하루일기 인덱스 "/diary/" 여기까지 라우팅
const BornDiaryIndex = ({ setIsBorn }) => {
  const navigate = useNavigate();

  // '산모수첩' 버튼 클릭 시
  const handleNavigateBack = () => {
    setIsBorn(false); // 부모 컴포넌트의 isBorn 상태를 false로 변경하면 자동으로 산모수첩으로 이동
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
      {/* 상단 산모수첩 버튼 영역 */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={handleNavigateBack}>
          산모수첩
        </button>
      </div>

      {/* 좌측 네비와 우측 컨텐츠를 담는 컨테이너 */}
      <div className={styles.contentLayout}>
        <div className={styles.leftPanel}>
          {/*하루일기 좌측 네비바(통계 등 나오는 곳)*/}
          <EverydayNavi
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            avg={avg}
            handleSearch={handleSearch} />
        </div>

        <div className={styles.rightContent}>
          {/*하루일기 디테일 or 작성 페이지 라우팅*/}
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
              />} /> {/*디테일 다이어리*/}

            {/*<Route path="everydaywrite" element={<EverydayWrite
            />} />
            다이어리 작성*/}
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default BornDiaryIndex;
