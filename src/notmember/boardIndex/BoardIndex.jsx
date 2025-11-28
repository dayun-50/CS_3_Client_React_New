import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import BoardList from "./boardlist/BoardList";
import BoardDetail from "./boardDetail/BoardDetail";
import BoardWrite from "./boardWrite/BoardWrite";
import styles from "./BoardIndex.module.css";
import { caxios } from "config/config";

//보드인덱스 /board/ 까지 라우팅
const BoardIndex = () => {
  const navigate = useNavigate();

  //삭제버튼
  const handleDeleteBoard = (seq) => { //게시글 삭제 버튼, 시퀀스 번호 전달받기
    caxios.delete("/board/delete", {
      params: { seq }
    })
      .then(resp => {
        alert("삭제되었습니다");
        window.history.back(); //삭제 후 이전 페이지로 이동
      })
      .catch(err => { console.log(err); alert("삭제에 실패했습니다 다시 시도해주세요"); });
  }
  //수정버튼
  const handleEditBoard = (seq) => { //게시글 수정 버튼,시퀀스 번호 전달받기
    navigate("/board/write", {
      state: {
        mode: "edit",
        board_seq: seq
      }
    })
  }


  return (
    <div className={styles.container}>
      <Routes>
        <Route path="" element={<BoardList handleDeleteBoard={handleDeleteBoard} handleEditBoard={handleEditBoard} />} /> {/*보드 리스트*/}
        <Route path="detail" element={<BoardDetail handleDeleteBoard={handleDeleteBoard} handleEditBoard={handleEditBoard} />} /> {/*보드디테일*/}
        <Route path="write" element={<BoardWrite />} /> {/*보드작성*/}
      </Routes>
    </div>
  );
};
export default BoardIndex;
