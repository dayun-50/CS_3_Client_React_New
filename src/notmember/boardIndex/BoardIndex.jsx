import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import BoardList from "./boardlist/BoardList";
import BoardDetail from "./boardDetail/BoardDetail";
import BoardWrite from "./boardWrite/BoardWrite";
import styles from "./BoardIndex.module.css";
import { caxios } from "config/config";
import { useState } from "react";
const BoardIndex = () => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBoard = (seq) => {
    if (isDeleting) return;
    caxios.delete("/board/delete", {
      params: { seq }
    })
      .then(resp => {
        alert("삭제되었습니다");
        navigate("/board", { state: { refresh: true } });
      })
      .catch(err => {alert("삭제에 실패했습니다 다시 시도해주세요"); })
      .finally(() => {
        setIsDeleting(false); 
      });
  }
  const handleEditBoard = (seq) => { 
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
        <Route path="" element={<BoardList handleDeleteBoard={handleDeleteBoard} handleEditBoard={handleEditBoard} isDeleting={isDeleting} />} />
        <Route path="detail" element={<BoardDetail handleDeleteBoard={handleDeleteBoard} handleEditBoard={handleEditBoard} isDeleting={isDeleting} />} /> 
        <Route path="write" element={<BoardWrite />} />
      </Routes>
    </div>
  );
};
export default BoardIndex;
