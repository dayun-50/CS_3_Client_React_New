import React from "react";
import styles from "./Counseling.module.css";

const Counseling = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <button className={styles.closeBtn} onClick={onClose}>
        닫기
      </button>
      <h2>긴급 상담</h2>
      <p>여기에 상담 내용이나 폼을 추가하세요.</p>
    </div>
  );
};

export default Counseling;
