import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UnBornDiaryIndex from "./unborn/unbornIndex/UnbornIndex";
import BornDiaryIndex from "./born/bornDiaryIndex/BornDiaryIndex";
import styles from "./DiaryIndex.module.css";

const DiaryIndex = () => {
  const bornDueDate = sessionStorage.getItem("babyDueDate");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });

  const [isBorn, setIsBorn] = useState(bornDueDate <= today);

  return (
    <div className={styles.container}>
      {isBorn ? <BornDiaryIndex setIsBorn={setIsBorn} /> : <UnBornDiaryIndex />}
    </div>
  );
};
export default DiaryIndex;
