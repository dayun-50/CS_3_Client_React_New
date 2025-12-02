import React from "react";
import styles from "./BabyCheckList.module.css";
import UseBabyCheckList from "./UseBabyCheckList";

const BabyCheckList = () => {
  const {
    data, handleClick
  } = UseBabyCheckList();

  return (
      <div className={styles.container}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item.record_seq}
              className={item.type === "past" ? styles.past : styles.future}
            >
              <div className={item.type === "past" ? styles.pastLeft : styles.futureLeft}>
                <div className={item.type === "past" ? styles.pastBadge : styles.futureBadge}>
                  {item.badge}
                </div>
                <div className={item.type === "past" ? styles.pastContent : styles.futureContent}>
                  <div className={item.type === "past" ? styles.pastText : styles.futureText}>
                    {item.text}
                  </div>
                  <div className={item.type === "past" ? styles.pastDate : styles.futureDate}>
                    {item.date}
                  </div>
                </div>
              </div>

              <div className={item.type === "past" ? styles.pastAction : styles.futureAction}>
                <div className={item.type === "past" ? styles.pastDivider : styles.futureDivider}></div>
                <button className={item.type === "past" ? styles.pastButton : styles.futureButton} onClick={() => handleClick(item.test_code)}>
                  {item.buttonText}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>일정이 없습니다.</div>
        )}
      </div>
  );
};

export default BabyCheckList;
