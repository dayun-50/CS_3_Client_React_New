import styles from "./BabyInfoPic.module.css";
import backImg from "./img/back.svg";
import backImg2 from "./img/back2.svg";
import jionebabyImg from "./img/jionebaby.svg";
import childrenImg from "./img/children.svg";
import useAuthStore from "store/useStore";

const BabyInfoPic = () => {
  const today = new Date().toISOString().split("T")[0];
  const babyDueDate = useAuthStore((state) => state.babyDueDate);
  const type = today >= babyDueDate ? "child" : "mom";

  const backgroundImage = type === "mom" ? backImg : backImg2;
  const frontImage = type === "mom" ? jionebabyImg : childrenImg;

  const imageClasses = `
  ${styles.jionewbabyImage}
  ${type === "child" ? styles.childrenImage : ""}
  `;

  return (
    <div className={styles.leftcontainer}>
      <img src={backgroundImage} alt="bg" className={styles.backImage} />
      <img src={frontImage} alt="baby" className={imageClasses} />
    </div>
  );
};

export default BabyInfoPic;
