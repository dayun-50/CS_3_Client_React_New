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
import Loading from "common/loading/Loading";

import styles from "./MainIndex.module.css";
import useAuthStore from "../../store/useStore";
import { caxios } from "config/config";
import PrivateRoute, { ToLogin } from "privateRoute";
import LoginBox from "notmember/login/loginBox/LoginBox";
import Login from "notmember/login/Login";

import { useEffect, useRef, useState } from "react";
import BornDiaryIndex from "member/diaryIndex/born/bornDiaryIndex/BornDiaryIndex";
import Counseling from "member/counseling/Counseling";

const MainIndex = ({ alerts, setAlerts }) => {
  const { isLogin } = useAuthStore((state) => state);
  const location = useLocation();

  /* -----------------------------
   *  모든 Hook은 조건문 밖 최상단
  --------------------------------*/
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(98);
  const [isCounselOpen, setIsCounselOpen] = useState(false);

  const isInfoPage = !isLogin && location.pathname === "/";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    const paths = [
      "/board",
      "/mypage",
      "/babymypage",
      "/checklist",
      "/chart",
      "/diary",
    ];
    const currentPath = location.pathname;

    console.log("현재 path:", currentPath);

    if (paths.includes(currentPath)) {
      caxios
        .post("/dashCart", { path: currentPath })
        .catch((err) => console.log(err));
    }
  }, [location, isLogin]);

  /* -----------------------------
   *  헤더 높이 자동 측정
  --------------------------------*/
  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => {
      setHeaderHeight(headerRef.current.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  /* -----------------------------
   * 노란 배경을 써야 하는 경로
  --------------------------------*/
  const yellowBackgroundPaths = ["/", "/babyIndex", "/babymypage"];

  const isYellowBackground =
    isLogin &&
    yellowBackgroundPaths.some((path) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path)
    );

  const mainLayoutClassName = isYellowBackground
    ? styles.layoutMainYellow
    : styles.layoutMain;

  if (isLoading) {
    return <Loading message="페이지를 준비하고 있습니다" />;
  }

  return (
    <div className={styles.container}>
      {/* 헤더 (Information 페이지에서만 고정) */}
      <header
        ref={headerRef}
        className={
          isInfoPage ? styles.MemberHeaderFixed : styles.MemberHeaderNormal
        }
      >
        <CommonHeader isLogin={isLogin} alerts={alerts} setAlerts={setAlerts} setIsCounselOpen={setIsCounselOpen} />
      </header>

      {/* 메인 */}
      <div className={mainLayoutClassName}>
        <Routes>
          <Route path="" element={!isLogin ? <Information /> : <BabyIndex />} />
          {/*로그인 안되어 있으면 ? 인포메이션 : 되면 베이비인덱스*/}


          <Route path="board/*" element={<BoardIndex />} /> {/*커뮤니티*/}
          {/*-----------------------------------------------------------------------여기까지는 비회원도 접근 가능한 부분 아래는 불가하게 막아야함*/}
          <Route
            path="mypage"
            element={
              <PrivateRoute>
                <ParentInfoIndex />
              </PrivateRoute>
            }
          />
          <Route
            path="babymypage"
            element={
              <PrivateRoute>
                <BabyInfoIndex />
              </PrivateRoute>
            }
          />
          {/*아기 마이페이지*/}
          <Route
            path="checklist"
            element={
              <PrivateRoute>
                <CheckListIndex />
              </PrivateRoute>
            }
          />
          {/*검진 체크리스트*/}
          <Route
            path="chart/*"
            element={
              <PrivateRoute>
                <ChartIndex />
              </PrivateRoute>
            }
          />{" "}
          {/*차트*/}
          <Route
            path="diary/*"
            element={
              <PrivateRoute>
                <DiaryIndex />
              </PrivateRoute>
            }
          />{" "}
          {/*산모수첩*/}
          <Route path="*" element={<ToLogin />} />
        </Routes>
      </div>
      {/* 긴급상담 */}
      {isCounselOpen && (
        <Counseling onClose={() => setIsCounselOpen(false)} />
      )}
    </div>
  );
};

export default MainIndex;
