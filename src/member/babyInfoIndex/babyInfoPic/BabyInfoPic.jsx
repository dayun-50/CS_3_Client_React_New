import styles from "./BabyInfoPic.module.css";
import backImg from "./img/back.png";
import jionebabyImg from "./img/jionebaby.png";
import childrenImg from "./img/children.png";

const BabyInfoPic = ({ type = "mom" }) => {
  return (
    <div className={styles.leftcontainer}>
      <div className={styles.one}>
        <img src={backImg} alt="back" className={styles.backImage} />
      </div>
      <div className={styles.two}>
        <img
          src={type === "mom" ? jionebabyImg : childrenImg}
          alt="baby"
          className={styles.jionewbabyImage}
        />
      </div>
    </div>
  );
};

export default BabyInfoPic;
