import styles from "./BabyButton.module.css";

// isPregnant : 현재 사용자가 임산부 상태인지
// onEmergencyClick : 긴급 상담 클릭 시 부모에서 처리할 콜백
const BabyButton = ({ isPregnant = true, onEmergencyClick }) => {
  // 버튼 항목 데이터
  const baseItems = [
    {
      label: "아기 정보",
      path: "/babymypage",
      iconColor: "#f0d827",
    },
    {
      label: "건강 기록",
      path: "/checklist",
      iconColor: "#f0d827",
    },
    {
      label: "성장차트",
      path: "/chart",
      iconColor: "#f0d827",
    },
  ];

  // 임산부 전용/육아 전용 항목 분리
  const pregnantItems = [
    {
      label: "산모수첩",
      path: "/diary",
      iconColor: "#f0d827",
    },
    {
      label: "긴급 상담",
      path: "/counseling",
      iconColor: "#f0d827",
    },
  ];

  const parentingItems = [
    {
      label: "하루 일기",
      path: "/diary",
      iconColor: "#f0d827",
    },
    {
      label: "긴급 상담",
      path: "/counseling",
      iconColor: "#f0d827",
    },
  ];

  // 메뉴 목록 결정
  let navItems = [...baseItems];

  if (isPregnant) {
    navItems = [...baseItems, ...pregnantItems];
  } else {
    navItems = [...baseItems, ...parentingItems];
  }

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.buttonList}>
        {navItems.map((item, index) => {
          // "긴급 상담" 버튼만 클릭 이벤트 처리
          if (item.label === "긴급 상담") {
            return (
              <div
                key={index}
                className={styles.navButton}
                onClick={onEmergencyClick} // 부모에서 오른쪽 섹션 변경
                style={{ cursor: "pointer" }}
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

          // 나머지 버튼은 기존 링크 그대로
          return (
            <a key={index} href={item.path} className={styles.navButton}>
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
