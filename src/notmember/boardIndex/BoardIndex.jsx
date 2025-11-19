import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BoardList from "./boardlist/BoardList";
import BoardDetail from "./boardDetail/BoardDetail";
import BoardWrite from "./boardWrite/BoardWrite";
import styles from "./BoardIndex.module.css";

//보드인덱스 /board/ 까지 라우팅
const BoardIndex = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="" element={<BoardList />} /> {/*보드 리스트*/}
        <Route path="detail" element={<BoardDetail />} /> {/*보드디테일*/}
        <Route path="write" element={<BoardWrite />} /> {/*보드작성*/}
      </Routes>
    </div>
  );
};
export default BoardIndex;
