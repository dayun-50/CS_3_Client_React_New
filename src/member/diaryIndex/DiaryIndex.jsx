import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UnBornDiaryIndex from "./unborn/unbornIndex/UnbornIndex";
import BornDiaryIndex from "./born/bornDiaryIndex/BornDiaryIndex";
import styles from "./DiaryIndex.module.css";

//산모수첩 인덱스 "/diary/" 여기까지 라우팅
const DiaryIndex = () => {







  //아기dto 값에서 태어났는지 여부에 따라서 산모수첩을 보여줄지, 하루일기를 보여줄 지 가르기
  const bornDueDate = sessionStorage.getItem("babyDueDate");
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });

  // 태어났는지 여부 계산
  const [isBorn, setIsBorn] = useState(bornDueDate <= today);

  return (

    <div className={styles.container}>
      {/*아기 태어났으면 산모수첩 : 아니면 하루일기*/}
      {isBorn ? (<BornDiaryIndex setIsBorn={setIsBorn} />) : (<UnBornDiaryIndex />)}
    </div>
  );


}
export default DiaryIndex;
