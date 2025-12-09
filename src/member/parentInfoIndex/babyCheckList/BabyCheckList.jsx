import React from "react";
import styles from "./BabyCheckList.module.css";
import UseBabyCheckList from "./UseBabyCheckList";
import {
  Inbox,
} from "lucide-react";


const BabyCheckList = () => {
  const {
    data, handleClick
  } = UseBabyCheckList();

  return (
      <div className={`${styles.container} ${data.length === 0 ? styles.emptyContainer : ""}`} >
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
          <div className={styles.emptyMessage}>
  <Inbox />  {/* 아이콘 */}
  <div>일정이 존재하지 않습니다</div>  {/* 텍스트 */}
  <p className={styles.emptySubText}>건강기록을 작성해보세요</p>  {/* 서브 텍스트 */}
</div>
        )}
      </div>
  );
};

export default BabyCheckList;
