// BabyButton.jsx
import styles from "./BabyButton.module.css";
import { useLocation } from "react-router-dom";
import { User, Heart, Activity, Book, AlertCircle } from "lucide-react";

const BabyButton = ({ onEmergencyClick, isVertical = false, isBorn }) => {
  const location = useLocation();

  // 기본 버튼
  const baseItems = [
    {
      label: "아기 정보",
      path: "/babymypage",
      icon: <User size={20} strokeWidth={3} />,
    },
    {
      label: "건강 기록",
      path: "/checklist",
      icon: <Activity size={20} strokeWidth={3} />,
    },
    {
      label: "성장차트",
      path: "/chart",
      icon: <Heart size={20} strokeWidth={3} />,
    },
  ];

  // 산모용
  const pregnantItems = [
    {
      label: "산모수첩",
      path: "/diary",
      icon: <Book size={20} strokeWidth={3} />,
    },
    { label: "긴급 상담",
      // path : "/counseling",
      icon: <AlertCircle size={20} strokeWidth={3} /> },
  ];

  // 육아용
  const parentingItems = [
    {
      label: "하루 일기",
      path: "/diary",
      icon: <Book size={20} strokeWidth={3} />,
    },
    { label: "긴급 상담",
      // path : "/counseling",
      icon: <AlertCircle size={20} strokeWidth={3} /> },
  ];

  const navItems = [...baseItems, ...(isBorn ? parentingItems : pregnantItems)];

  return (
    <div className={styles.navigationContainer}>
      <div
        className={`${styles.buttonList} ${
          isVertical ? styles.verticalList : ""
        }`}
      >
        {navItems.map((item, index) => {
          const isActive = item.path
            ? location.pathname.startsWith(item.path)
            : false;

          if (item.label === "긴급 상담") {
            return (
              <div
                key={index}
                className={`${styles.navButton} ${
                  isActive ? styles.activeButton : ""
                }`}
                onClick={onEmergencyClick}
              >
                <div className={styles.iconLabelGroup}>
                  <div className={styles.iconCircle}>{item.icon}</div>
                  <div className={styles.labelText}>{item.label}</div>
                </div>
              </div>
            );
          }

          return (
            <a
              key={index}
              href={item.path}
              className={`${styles.navButton} ${
                isActive ? styles.activeButton : ""
              }`}
            >
              <div className={styles.iconLabelGroup}>
                <div className={styles.iconCircle}>{item.icon}</div>
                <div className={styles.labelText}>{item.label}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default BabyButton;
