import PrenatalList from "./prenatalList/PrenatalList";
import SymptomList from "./symptomList/SymptomList";
import styles from "./CheckListIndex.module.css";
import UseCheckListIndex from "./UseCheckListIndex";
import Loading from "common/loading/Loading";
import { motion } from "framer-motion";

// 주차별 체크리스트
const CheckListIndex = () => {
  const { babyData } = UseCheckListIndex();

  if (!babyData) {
    return <Loading message="데이터를 준비하고 있습니다" />;
  }

  return (
    <motion.div className={styles.CheckContainer}
    
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}>
      {/* Left 영역 (검진 리스트) */}
      <div className={styles.left}>
        <h2 className={styles.title}>주차별 산전 검진</h2>
        <div className={styles.listWrapper}>
          <PrenatalList babyData={babyData} />
        </div>
      </div>

      {/* Right 영역 (증상 리스트) */}
      <div className={styles.rigth}>
        <h2 className={styles.title}>증상 및 주의사항</h2>
        <div className={styles.listWrapper}>
          <SymptomList babyData={babyData} />
        </div>
      </div>
    </motion.div>
  );
};

export default CheckListIndex;
