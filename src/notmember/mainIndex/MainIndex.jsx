import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import CommonHeader from "../../common/commonheader/CommonHeader";
import Information from "../Information/Information";
import BabyIndex from "../../member/babyIndex/BabyIndex";
import BabyInfoIndex from "../../member/babyInfoIndex/BabyInfoIndex";
import CheckListIndex from "../../member/checkListIndex/CheckListIndex";
import ChartIndex from "../../member/chartIndex/ChartIndex";
import DiaryIndex from "../../member/diaryIndex/DiaryIndex";
import BoardIndex from "../boardIndex/BoardIndex";
import ParentInfoIndex from "../../member/parentInfoIndex/ParentInfoIndex";
import InputBaby from "../../member/inputBaby/InputBaby";
import styles from "./MainIndex.module.css";
import useAuthStore from "../../store/useStore";
import ChooseType from "../../member/chooseType/ChooseType";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { caxios } from "config/config";

//메인 인덱스 페이지
//여기서 로그인 여부에 따라서 보이고 안보이는게 다르게 만들어야함
// "/"밑으로 들어가느 라우팅
const MainIndex = ({ alerts, setAlerts }) => {
  const { isLogin, babySeq } = useAuthStore((state) => state);

  const location = useLocation(); //현재 URL 경로

  const [isLoading, setIsLoading] = useState(true);

  // 예: 로그인 정보, 초기 데이터 등 준비 후 로딩 해제
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // 실제 API 요청 후 false로 바꿀 수 있음
    }, 500); // 예시로 0.5초 후 로딩 종료
    return () => clearTimeout(timer);
  }, []);

  // 경로 변화 감지
  useEffect(() => {
    if (!isLogin) return;
    const paths = ["/board", "/mypage", "/babymypage", "/checklist", "/chart", "/diary"];
    console.log("현재 path:", location.pathname);
    if (paths.some(path => location.pathname.startsWith(path))) {
      caxios.post("/dashCart", { path: location.pathname })
        .catch(err => console.log(err));
    }
  }, [location, isLogin]);


  // 로딩 중이면 화면 전체 로딩 표시
  if (isLoading) {
    return <Loading message="페이지를 준비하고 있습니다" />;
  }

  // 배경 전체가 노란색이 나와야하는 경로 목록
  const yellowBackgroundPaths = ["/", "/babyIndex", "/babymypage"];

  // 현재 경로가 노란 배경을 사용할 경로에 포함되는지 확인
  const isYellowBackground =
    isLogin &&
    yellowBackgroundPaths.some((path) => {
      if (path == "/") {
        return location.pathname == "/";
      }
      return location.pathname.startsWith(path);
    });

  // 헤더와 메인 레이아웃에 적용할 클래스를 동적으로 결정
  const mainLayoutClassName = isYellowBackground
    ? styles.layoutMainYellow
    : styles.layoutMain;

  return (
    <div className={styles.container}>
      {/* 컨테이너 영역 */}
      {/* 헤더 영역 */}
      <header className={styles.MemberHeader}>
        <CommonHeader
          isLogin={isLogin}
          alerts={alerts}
          setAlerts={setAlerts}
        />
      </header>
      {/* 바디 영역 */}
      <div className={mainLayoutClassName}>
        <Routes>
          <Route path="" element={!isLogin ? <Information /> : <BabyIndex />} />
          {/*로그인 안되어 있으면 ? 인포메이션 : 되면 베이비인덱스*/}
          <Route path="board/*" element={<BoardIndex />} /> {/*커뮤니티*/}
          {/*-----------------------------------------------------------------------여기까지는 비회원도 접근 가능한 부분 아래는 불가하게 막아야함*/}
          <Route path="mypage" element={<ParentInfoIndex />} />
          <Route path="babymypage" element={<BabyInfoIndex />} />
          {/*아기 마이페이지*/}
          <Route path="checklist" element={<CheckListIndex />} />
          {/*검진 체크리스트*/}
          <Route path="chart/*" element={<ChartIndex />} /> {/*차트*/}
          <Route path="diary/*" element={<DiaryIndex />} /> {/*산모수첩*/}
        </Routes>
      </div>
    </div>
  );
};
export default MainIndex;
