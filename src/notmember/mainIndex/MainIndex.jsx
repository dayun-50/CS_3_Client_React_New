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
    if (paths.includes(currentPath)) {
      caxios
        .post("/dashCart", { path: currentPath });
    }
  }, [location, isLogin]);

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
      <header
        ref={headerRef}
        className={
          isInfoPage ? styles.MemberHeaderFixed : styles.MemberHeaderNormal
        }
      >
        <CommonHeader isLogin={isLogin} alerts={alerts} setAlerts={setAlerts} setIsCounselOpen={setIsCounselOpen} />
      </header>

      <div className={mainLayoutClassName}>
        <Routes>
          <Route path="" element={!isLogin ? <Information /> : <BabyIndex />} />

          <Route path="board/*" element={<BoardIndex />} />
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
          <Route
            path="checklist"
            element={
              <PrivateRoute>
                <CheckListIndex />
              </PrivateRoute>
            }
          />
          <Route
            path="chart/*"
            element={
              <PrivateRoute>
                <ChartIndex />
              </PrivateRoute>
            }
          />
          <Route
            path="diary/*"
            element={
              <PrivateRoute>
                <DiaryIndex />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<ToLogin />} />
        </Routes>
      </div>
      {isCounselOpen && (
        <Counseling onClose={() => setIsCounselOpen(false)} />
      )}
    </div>
  );
};

export default MainIndex;
