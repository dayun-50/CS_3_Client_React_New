import { useLocation } from "react-router-dom";
import BabyInfoPic from "./babyInfoPic/BabyInfoPic";
import BabyInfo from "./babyInfo/BabyInfo";
import styles from "./BabyInfoIndex.module.css";

const BabyInfoIndex = () => {
  // const location = useLocation();
  // const type = location.state?.type || "mom"; // ChooseType에서 넘어온 type

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <BabyInfoPic/>
      </div>
      <div className={styles.right}>
        <BabyInfo />
      </div>
    </div>
  );
};

export default BabyInfoIndex;
