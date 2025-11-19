import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CommonHeader from "../../common/commonheader/CommonHeader";
import Information from "../Information/Information";
import BabyIndex from "../../member/babyIndex/BabyIndex";
import BabyInfoIndex from "../../member/babyInfoIndex/BabyInfoIndex";
import CheckListIndex from "../../member/checkListIndex/CheckListIndex";
import ChartIndex from "../../member/chartIndex/ChartIndex";
import DiaryIndex from "../../member/diaryIndex/DiaryIndex";
import BoardIndex from "../boardIndex/BoardIndex";
import ParentInfoIndex from "../../member/parentInfoIndex/ParentInfoIndex";
import styles from "./MainIndex.module.css";

//메인 인덱스 페이지
//여기서 로그인 여부에 따라서 보이고 안보이는게 다르게 만들어야함
// "/"밑으로 들어가느 라우팅
const MainIndex = ({ isLogin }) => {

  
  return (
    <div className={styles.container}>
      {" "}
      {/*컨테이너 영역*/}
      {/*헤더 영역 :git 필요시 로그인 여부 데이터 넘겨서 display none 사용하세요*/}
      <header className={styles.MemberHeader}>
        <CommonHeader isLogin={isLogin} />
      </header>
      {/*바디 영역 : 필요시 로그인 여부 데이터 넘겨서 display none 사용하세요*/}
      <div className={styles.layoutMain}>
        <Routes>
          <Route path="" element={!isLogin ? <Information /> : <BabyIndex />} />{" "}
          {/*로그인 안되어 있으면 ? 인포메이션 : 되면 베이비인덱스*/}
          <Route path="board/*" element={<BoardIndex />} /> {/*커뮤니티*/}
          {/*-----------------------------------------------------------------------여기까지는 비회원도 접근 가능한 부분 아래는 불가하게 막아야함*/}
          <Route path="mypage" element={<ParentInfoIndex />} /> {/*회원가입*/}
          <Route path="babymypage" element={<BabyInfoIndex />} />{" "}
          {/*아기 마이페이지*/}
          <Route path="checklist" element={<CheckListIndex />} />{" "}
          {/*검진 체크리스트*/}
          <Route path="chart/*" element={<ChartIndex />} /> {/*차트*/}
          <Route path="diary/*" element={<DiaryIndex />} /> {/*산모수첩*/}
        </Routes>
      </div>
    </div>
  );
};
export default MainIndex;
