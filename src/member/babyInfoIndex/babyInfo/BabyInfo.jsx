import { useState, useEffect } from "react";
import styles from "./BabyInfo.module.css";
import UseBabyInfo from "./UseBabyInfo";
import { motion } from "framer-motion";

const BabyInfo = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 수정 상태

  const handleEdit = () => {
    // 수정 버튼 감지
    setIsEditing(true);
  };

  const {
    data,
    todayString,
    birthMinus7String,
    regex,
    inputCount,
    handleChange,
    handleSave,
    setData,
  } = UseBabyInfo(isEditing, selectedGender, setSelectedGender, setIsEditing);

  return (
    <motion.div
      className={styles.rightcontainer}
      initial={{ opacity: 0, x: 20 }} // 시작 상태: 살짝 아래, 투명
      animate={{ opacity: 1, x: 0 }} // 최종 상태: 원래 위치, 완전 불투명
      exit={{ opacity: 0, x: 20 }} // 언마운트 시: 다시 아래로, 투명
      transition={{ duration: 0.9 }} // 지속시간
    >
      <div className={styles.babyinformation}>
        {/* 제목 */}
        <div className={styles.bb}>
          <h1>아기 정보</h1>
        </div>

        {/* 이름 */}
        <div className={styles.babyla}>
          <label htmlFor="babyname">{`${data.status === "infant" ? "이름" : "태명"}`}</label>
          <input
            type="text"
            id="babyname"
            name="name"
            value={data.name || ""}
            onChange={handleChange}
            className={`${styles.babyname} ${!regex.name && inputCount.name > 0 ? styles.auth : ""
              }`}
            readOnly={!isEditing}
            style={{
              border: isEditing ? "1px solid #696B70" : "none",
              backgroundColor: isEditing ? "white" : "#FFF4D6",
              cursor: isEditing ? "text" : "default",
            }}
          />
        </div>

        {/* 출산예정일 */}
        <div className={styles.birthday}>
          <label htmlFor="birthday">{`${data.status === "infant" ? "생년월일" : "출산예정일"}`} </label>
          <input
            type="date"
            id="birthday"
            className={`${styles.babybirthday} ${!regex.birth_date && inputCount.birth_date > 0 ? styles.auth : ""
              }`}
            value={data.birth_date || ""}
            name="birth_date"
            onChange={handleChange}
            readOnly={!isEditing}
            {
            // 영유아
            ...(data.status == "infant"
              ? { min: birthMinus7String }
              : { min: todayString })
            }
            style={{
              border: isEditing ? "1px solid #696B70" : "none",
              backgroundColor: isEditing ? "white" : "#FFF4D6",
              cursor: isEditing ? "text" : "default",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        {/* 성별 */}
        <div className={styles.sex}>
          <h1 className={styles.sextitle}>성별</h1>
          <div className={styles.btns}>
            {isEditing ? (
              ["미정", "남자", "여자"]
                .filter(
                  (gender) => !(data.status === "infant" && gender === "미정")
                ) // ← infant면 미정 버튼 제외
                .map((gender) => (
                  <button
                    key={gender}
                    className={`${styles[
                      gender === "미정"
                        ? "quest"
                        : gender === "남자"
                          ? "manb"
                          : "girlb"
                      ]
                      } ${selectedGender === gender ? styles.active : ""}`}
                    onClick={() => {
                      setSelectedGender(gender); // 버튼 선택 상태
                      setData((prev) => ({ ...prev, gender })); // data.gender 동기화
                    }}
                    style={{
                      backgroundColor:
                        selectedGender === gender ? "#ADB9E3" : "white",
                      border:
                        selectedGender === gender
                          ? "none"
                          : "1px solid #8C8C8C",
                      cursor: "pointer",
                    }}
                  >
                    {gender === "미정" ? "미정?" : gender}
                  </button>
                ))
            ) : (
              <span
                style={{
                  display: "inline-block",
                  width: "188px",
                  height: "48px",
                  lineHeight: "48px",
                  textAlign: "start",
                  marginLeft:"10px",
                  fontSize:"16px",
                  color: "#696B70",
                }}
              >
                {data.gender}
              </span>
            )}
          </div>
        </div>

        {/* 몸무게 */}
        <div className={styles.kg}>
          <p>몸무게</p>
          <div className={styles.kgdb}>
            {data.family_code ? data.family_code : 0} Kg
          </div>
        </div>

        {/* 수정/완료/취소 버튼 */}
        <div className={styles.correct} style={{ gap: "20px" }}>
          {!isEditing ? (
            <button className={styles.corbt} onClick={handleEdit}>
              수정
            </button>
          ) : (
            <>
              <button
                className={styles.corbtd}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
              <button className={styles.corbtc} onClick={handleSave}>
                완료
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BabyInfo;
