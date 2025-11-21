import React from "react";
import styles from "./ChartInput.module.css";
import { useState } from "react";

// ChartInput 컴포넌트: 선택된 메뉴에 따라 입력 필드를 렌더링
const ChartInput = ({ menuList, activeMenu }) => {
  const activeItem = menuList[activeMenu];

  // 수정버튼 상리관리 - isEditing : true - 취소 / 수정완료 || false - 수정
  const [isEditing, setIsEditing] = useState(false);
  const [hasData, setHasData] = useState(false); // 여기서는 완료 버튼을 눌렀을 때 데이터가 있다고 가정하고 상태를 전환

  // '완료' 버튼 클릭 핸들러: 데이터가 저장되고 '수정' 버튼이 보이도록 상태 변경
  const handleSubmit = () => {
    // 실제로는 여기에 데이터 저장(Submit) 로직이 들어갑니다.
    console.log("데이터 저장(완료) 처리...");
    setHasData(true); // 데이터 저장 완료 후, '수정' 버튼이 보이도록 전환
    setIsEditing(false);
  };

  // '수정' 버튼 클릭
  const handleEdit = () => {
    setIsEditing(true); // 수정 모드 시작
  };

  // '취소' 또는 '수정완료' 버튼 클릭
  const handleCancelOrUpdate = () => {
    // '수정완료'의 경우: 데이터 업데이트 로직 || '취소'의 경우: 입력 상태 초기화 로직
    console.log("수정 취소 또는 수정 완료 처리 후, 수정 버튼으로 전환");
    setIsEditing(false); // 수정 모드 종료
    // setHasData는 유지되어야 '수정' 버튼이 보입니다.
  };

  // 단일 입력 필드를 렌더링할지 여부 판단 ('성장'가 아니면 true)
  const shouldRenderSingleInput = activeItem !== "성장";

  // 입력 항목이 '몸무게'인지 확인 (단위 g 표시용)
  const isWeightInput = activeItem === "몸무게";

  return (
    <div className={styles.sidePanel}>
      {/* 패널 상단 제목 */}
      <div className={styles.panelHeader}>{activeItem}</div>

      {/* 입력 필드 영역 */}
      <div className={styles.panelContent}>
        {/* 날짜 입력: 공통 필드 */}
        <label className={styles.label}>날짜</label>
        <input className={styles.input} type="date" placeholder="날짜" />

        {/*'성장' 메뉴 선택 시: 모든 항목 입력 필드 렌더링 */}
        {activeItem === "성장" && (
          <div className={styles.allInputGroup}>
            {menuList.slice(1).map((item) => (
              <div key={item} className={styles.inputGroup}>
                <label className={styles.label}>{item}</label>
                {/* 몸무게는 단위 g 표시 */}
                {item === "몸무게" ? (
                  <div className={styles.inputWithUnit}>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder={item}
                    />
                    <span className={styles.unit}>g</span>
                  </div>
                ) : (
                  <input
                    className={styles.input}
                    type="number"
                    placeholder={item}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 단일 메뉴 선택 시: 해당 항목만 입력 필드 렌더링 */}
        {shouldRenderSingleInput && activeItem !== "성장" && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>{activeItem}</label>
            {isWeightInput ? (
              <div className={styles.inputWithUnit}>
                <input
                  className={styles.input}
                  type="number"
                  placeholder={activeItem}
                />
                <span className={styles.unit}>g</span>
              </div>
            ) : (
              <input
                className={styles.input}
                type="number"
                placeholder={activeItem}
              />
            )}
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className={styles.buttonRow}>
        {/* 1. 처음에 데이터가 없을 때 (hasData: false) */}
        {!hasData && (
          <button className={styles.submitBtn} onClick={handleSubmit}>
            완료
          </button>
        )}

        {/* 2. 데이터가 있고 수정 모드일 때 (hasData: true, isEditing: true) */}
        {hasData && isEditing && (
          <>
            <button className={styles.cancelBtn} onClick={handleCancelOrUpdate}>
              취소
            </button>
            <button className={styles.submitBtn} onClick={handleCancelOrUpdate}>
              수정완료
            </button>
          </>
        )}

        {/* 3. 데이터가 있고 완료 상태일 때 (hasData: true, isEditing: false) */}
        {hasData && !isEditing && (
          <button className={styles.submitBtn} onClick={handleEdit}>
            수정
          </button>
        )}
      </div>
    </div>
  );
};

export default ChartInput;
