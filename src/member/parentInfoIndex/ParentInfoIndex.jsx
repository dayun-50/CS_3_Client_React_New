import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Mypage from "./mypage/Mypage";
import BabyController from "../../common/babySideNavi/babyController/BabyController";
import styles from "./ParentInfoIndex.module.css";
import BabyCheckList from "./babyCheckList/BabyCheckList";

// 부모 마이페이지
const ParentInfoIndex = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* 좌측 부모 정보부분 */}
        <Mypage />
      </div>

      <div className={styles.right}>
        {/* 아기 추가 및 이동 부분 */}
        <BabyController />
        {/* 아기 건강일지 항목 리스트 */}
        <BabyCheckList />
      </div>
    </div>
  );
};

export default ParentInfoIndex;
