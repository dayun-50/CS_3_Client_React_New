import { useState, useEffect } from "react";
import styles from "./BabyInfo.module.css";
import UseBabyInfo from "./UseBabyInfo";
import { motion } from "framer-motion";

const BabyInfo = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.9 }}
    >
      <div className={styles.babyinformation}>
        <div className={styles.bb}>
          <h1>아기 정보</h1>
        </div>

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
              border: isEditing ? "1px solid var(--color-font-back)" : "none",
              backgroundColor: isEditing ? "white" : "#FFF4D6",
              cursor: isEditing ? "text" : "default",
            }}
          />
        </div>

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
            ...(data.status == "infant"
              ? { min: birthMinus7String }
              : { min: todayString })
            }
            style={{
              border: isEditing ? "1px solid var(--color-font-back)" : "none",
              backgroundColor: isEditing ? "white" : "#FFF4D6",
              cursor: isEditing ? "text" : "default",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        <div className={styles.sex}>
          <h1 className={styles.sextitle}>성별</h1>
          <div className={styles.btns}>
            {isEditing ? (
              ["미정", "남자", "여자"]
                .filter(
                  (gender) => !(data.status === "infant" && gender === "미정")
                )
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
                      setSelectedGender(gender);
                      setData((prev) => ({ ...prev, gender }));
                    }}
                    style={{
                      backgroundColor:
                        selectedGender === gender ? "#ADB9E3" : "white",
                      border:
                        selectedGender === gender
                          ? "none"
                          : "1px solid var(--color-font-back)",
                      cursor: "pointer",
                    }}
                  >
                    {gender === "미정" ? "아직몰라요" : gender}
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
                  marginLeft: "10px",
                  fontSize: "16px",
                  color: "#696B70",
                }}
              >
                {data.gender}
              </span>
            )}
          </div>
        </div>

        <div className={styles.kg}>
          <p>몸무게</p>
          <div className={styles.kgdb}>
            {data.family_code ? `${data.family_code} Kg` : `아직 성장차트에 기록이 없습니다.`}
          </div>
        </div>

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
