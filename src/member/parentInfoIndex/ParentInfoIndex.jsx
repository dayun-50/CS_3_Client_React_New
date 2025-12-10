import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Mypage from "./mypage/Mypage";
import BabyController from "../../common/babySideNavi/babyController/BabyController";
import styles from "./ParentInfoIndex.module.css";
import BabyCheckList from "./babyCheckList/BabyCheckList";

const ParentInfoIndex = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Mypage />
      </div>

      <div className={styles.right}>
        <BabyController />
        <BabyCheckList />
      </div>
    </div>
  );
};

export default ParentInfoIndex;
