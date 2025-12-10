import styles from "./BabyBox.module.css";
import backgrond from "./imgs/Background.svg";
import infants from "./imgs/Infants.svg";
import backgrond2 from "./imgs/Background2.svg";
import toddlers from "./imgs/Toddlers.svg";
import { motion } from "framer-motion";
import { useBabyBox } from "./UseBabyBox";

const imageVariantsPregnant = {
  initial: { opacity: 0, rotate: 0 },
  animate: {
    opacity: 1,
    y: [0, -5, 0],
    rotate: [0, -20, 20, 0],
    transition: {
      opacity: { duration: 0.5 },
      y: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
      rotate: {
        duration: 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  },
};

const imageVariantsParenting = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    y: [0, -15, 0],
    transition: {
      y: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeOut",
      },
      opacity: { duration: 0.5 },
    },
  },
};

const BabyBox = ({ setIsBorn }) => {
  const { data, isDuePassed, dueDateStatus, isParenting } = useBabyBox({
    setIsBorn,
  });

  let backgroundImage = backgrond;
  let mainImage = infants;
  if (isParenting) {
    backgroundImage = backgrond2;
    mainImage = toddlers;
  }

  return (
    <div className={styles.container}>
      <div className={styles.babyImagePlaceholder}>
        <b className={styles.babyName}>{data.name}</b>
        <div className={styles.dueDate}>{dueDateStatus}</div>
      </div>

      <div className={styles.mainContentArea}>
        <div>
          <img
            src={backgroundImage}
            className={styles.backgrondImage}
            alt="배경"
          />
        </div>
        <div>
          <motion.img
            src={mainImage}
            className={`${styles.placeholderImage} ${isParenting ? styles.parentingImage : styles.placeholderImage
              }`}
            alt={isParenting ? "육아" : "아기"}
            initial="initial"
            animate="animate"
            variants={
              isParenting ? imageVariantsParenting : imageVariantsPregnant
            }
          />
        </div>
      </div>
    </div>
  );
};
export default BabyBox;
