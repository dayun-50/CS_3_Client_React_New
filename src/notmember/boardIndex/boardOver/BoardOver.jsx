// src/notmember/boardIndex/boardOver/BoardOver.jsx
import React, { useState } from "react";
import styles from "./BoardOver.module.css";
import { caxios } from "config/config";
import { X } from "lucide-react";

const BoardOver = ({ isOpen, onClose, boardSeq, commentSeq }) => {
  const [data, setData] = useState("");
  if (!isOpen) return null;

  const hendleChange = (e) => {
    const value = e.target.value;
    setData(value);
  };

  const handleSubmitReport = () => {
    let keyname = "";
    let pathName = "";
    let value = "";
    if (!data) {
      alert("신고 사유를 선택해주쉐요.");
      return;
    }
    if (boardSeq) {
      keyname = "board_seq";
      pathName = "boardSeq";
      value = boardSeq;
    } else if (commentSeq) {
      keyname = "comment_seq";
      pathName = "commentSeq";
      value = commentSeq;
    }

    caxios
      .post(`/report/${pathName}`, { [keyname]: value, report_type: data })
      .then((resp) => {
        alert("신고 완료되었습니다.");
      })

    onClose();
  };

  const isSubmitActive = !!data;

  return (
    <div className={styles.reportOverlay} onClick={onClose}>
      <div className={styles.reportBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.reportHeader}>
          <h2 className={styles.reportTitle}>
            {boardSeq ? "게시글" : "댓글"} 신고
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        <p className={styles.reportInstruction}>신고 사유를 선택해 주세요.</p>

        <div className={styles.reportOptions}>
          <label className={styles.reportLabel}>
            <input
              type="radio"
              name="reason"
              onChange={hendleChange}
              value="욕설 및 적절하지 않은 용어 사용"
              checked={data === "욕설 및 적절하지 않은 용어 사용"}
            />
            욕설 및 적절하지 않은 용어 사용
          </label>
          <label className={styles.reportLabel}>
            <input
              type="radio"
              name="reason"
              onChange={hendleChange}
              value="광고성 게시물"
              checked={data === "광고성 게시물"}
            />
            광고성 게시물
          </label>
          <label className={styles.reportLabel}>
            <input
              type="radio"
              name="reason"
              onChange={hendleChange}
              value="태그와 관련없는 글"
              checked={data === "태그와 관련없는 글"}
            />
            태그와 관련없는 글
          </label>
          <label className={styles.reportLabel}>
            <input
              type="radio"
              name="reason"
              onChange={hendleChange}
              value="불법 복제 및 저작권 침해 글"
              checked={data === "불법 복제 및 저작권 침해 글"}
            />
            불법 복제 및 저작권 침해 글
          </label>
        </div>

        <div className={styles.reportBtnArea}>
          <button
            className={`${styles.reportSubmitBtn} ${!isSubmitActive ? styles.disabledBtn : ""
              }`}
            onClick={isSubmitActive ? handleSubmitReport : undefined}
            disabled={!isSubmitActive}
          >
            신고 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardOver;
