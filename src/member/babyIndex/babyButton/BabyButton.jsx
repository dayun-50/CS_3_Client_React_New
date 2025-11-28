import styles from "./BabyButton.module.css";
import { useLocation } from "react-router-dom";

// isPregnant : 현재 사용자가 임산부 상태인지
// onEmergencyClick : 긴급 상담 클릭 시 부모에서 처리할 콜백
// isVertical - 사이드 네비바가 아닌경우 가로 사이드 네비바면 true로 변경해서 세로로 css 적용
const BabyButton = ({
  isPregnant = true,
  onEmergencyClick,
  isVertical = false,
}) => {
  const location = useLocation(); // 현재 URL 가져오기

  // 카테고리 메뉴
  const baseItems = [
    { label: "아기 정보", path: "/babymypage", iconColor: "#f0d827" },
    { label: "건강 기록", path: "/checklist", iconColor: "#f0d827" },
    { label: "성장차트", path: "/chart", iconColor: "#f0d827" },
  ];

  // 산모용
  const pregnantItems = [
    { label: "산모수첩", path: "/diary", iconColor: "#f0d827" },
    { label: "긴급 상담", path: "/counseling", iconColor: "#f0d827" },
  ];

  // 육아용
  const parentingItems = [
    { label: "하루 일기", path: "/diary", iconColor: "#f0d827" },
    { label: "긴급 상담", path: "/counseling", iconColor: "#f0d827" },
  ];

  // 메뉴 목록 결정
  // let navItems = [...baseItems];
  // if (isPregnant) {
  //   navItems = [...baseItems, ...pregnantItems];
  // } else {
  //   navItems = [...baseItems, ...parentingItems];
  // }

  const navItems = [
    ...baseItems,
    ...(isPregnant ? pregnantItems : parentingItems),
  ];

  return (
    <div
      className={`${styles.navigationContainer} ${
        isVertical ? styles.verticalList : ""
      } `}
    >
      <div className={styles.buttonList}>
        {navItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          // 현재 URL과 비교 - item.path => /diary 이고 /diary/write → startsWith로 true 처리

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
                  <div
                    className={styles.iconCircle}
                    style={{ backgroundColor: item.iconColor }}
                  />
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
                <div
                  className={styles.iconCircle}
                  style={{ backgroundColor: item.iconColor }}
                />
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
