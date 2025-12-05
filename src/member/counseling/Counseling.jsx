import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom"; // Portal 사용
import styles from "./Counseling.module.css"; // CSS 모듈 import
import pointImg from "./img/point.png"; // 전송 버튼 이미지 import
import useCounseling from "./useCounseling";
import { caxios } from "../../config/config";

// Counseling 컴포넌트: 긴급 상담 채팅창
const Counseling = ({ onClose }) => {
  const messageEndRef = useRef(null); // 메시지 + 로딩 포함 스크롤 참조
  const [inputText, setInputText] = useState(""); // 입력창 상태
  const [messages, setMessages] = useState([]); // 채팅 메시지 배열 상태
  const [inputDisabled, setInputDisabled] = useState(true); // 인풋 AI상담 누를시에만 작성가능
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상황

  const { selectBtn } = useCounseling(setInputText, setMessages, setInputDisabled);

  const now = new Date();
  const formatTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 컴포넌트가 처음 렌더링될 때 챗봇이 먼저 인사 메시지 전송 및 버튼 메시지 추가
  useEffect(() => {
    const firstMsg = {
      text: "혜빈이는 긴급하다옹",
      sender: "other",
      time: formatTime,
      senderName: "챗봇"
    };

    const buttons = ["입덧이 심해요.", "아이가 열이 나요.", "아이가 토를 해요.", "AI 상담"];
    const buttonMessages = buttons.map(btnText => ({
      sender: "other",
      time: formatTime,
      senderName: "챗봇",
      isButton: true,
      btnText // 버튼에 표시할 텍스트
    }));

    setMessages([firstMsg, ...buttonMessages]);
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (inputText.trim() === "" || isLoading) return;

    setMessages(prev => [
      ...prev,
      { text: inputText, sender: "me", time: formatTime, senderName: "나" }
    ]);

    setTimeout(() => {
      setIsLoading(true);
    }, 500);

    caxios.post("/chatBoot/aiAnswer", { question: inputText })
      .then(resp => {
        const aiAnswer = resp.data;
        setMessages(prev => [
          ...prev,
          { text: aiAnswer, sender: "other", time: formatTime, senderName: "챗봇" }
        ]);
      })
      .catch(err => {
        console.log(err);
        setMessages(prev => [
          ...prev,
          { text: "응답을 가져오는 데 실패했습니다. 다시 시도해 주세요.", sender: "system", time: formatTime, senderName: "시스템" }
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setInputText(""); // 입력창 초기화
  };

  // 메시지 + 로딩 메시지가 바뀔 때 스크롤 자동 이동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Portal로 body 최상위에 렌더링
  return ReactDOM.createPortal(
    <div className={styles.container} style={{ zIndex: 10000, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* 왼쪽 클릭 시 모달 닫기 */}
      <div className={styles.left} onClick={onClose}></div>

      {/* 오른쪽 채팅창 */}
      <div className={styles.right} onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <div className={styles.up}>
          <div className={styles.oneonenine}>긴급 상담</div>
          {/* 오른쪽 X 버튼 */}
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className={styles.down}>
          <div className={styles.chatbody} ref={messageEndRef}>
            <div className={styles.mes}>
              {messages.map((msg, idx) => {
                const isMe = msg.sender === "me";

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      marginBottom: "10px",
                      gap: "2px",
                      width: "100%"
                    }}
                  >
                    {msg.senderName && (
                      <span style={{ fontSize: "16px", fontWeight: "bold", color: "#808080" }}>
                        {msg.senderName}
                      </span>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                        gap: "5px",
                        width: "100%",
                        flexWrap: "wrap"
                      }}
                    >
                      {isMe && <span style={{ fontSize: "12px", color: "#888" }}>{msg.time}</span>}

                      <div
                        style={{
                          maxWidth: "70%",
                          backgroundColor: isMe ? "#adb9e3" : "#FFF4D6",
                          padding: "10px 14px",
                          borderRadius: "15px",
                          fontSize: "14px",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          boxSizing: "border-box"
                        }}
                      >
                        {/* 버튼 메시지면 span 생략 */}
                        {!msg.isButton && <span>{msg.text}</span>}

                        {/* 버튼은 항상 표시 */}
                        {!isMe && msg.isButton && (
                          <button
                            onClick={selectBtn} 
                            style={{
                              marginTop: "5px",
                              padding: "5px 10px",
                              borderRadius: "20px",
                              border: "none",
                              backgroundColor:"#F0D827",
                              cursor: "pointer",
                              fontSize: "14px",
                              color:"#ffffff",
                              fontWeight:"bold",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "normal"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "#e0c817"}
                            onMouseOut={e => e.currentTarget.style.background = "#F0D827"}
                          >
                            {msg.btnText} {/* 버튼 안 글씨 */}
                          </button>
                        )}
                      </div>

                      {!isMe && <span style={{ fontSize: "12px", color: "#888" }}>{msg.time}</span>}
                    </div>
                  </div>
                );
              })}

              {/* 로딩 메시지 */}
              {isLoading && (
                <div className={styles.loadingMessage}>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: "#808080" }}>
                    챗봇
                  </span>
                  <div
                    style={{
                      maxWidth: "70%",
                      backgroundColor: "#FFF4D6",
                      padding: "10px 14px",
                      borderRadius: "15px",
                      fontSize: "14px",
                      color: "#333",
                      fontStyle: "italic"
                    }}
                  >
                    <span>답변 대기 중입니다...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 메시지 입력 영역 */}
          <div className={styles.chatmessage}>
            <div className={styles.chme}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="메시지를 입력하세요"
                disabled={inputDisabled}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button className={styles.send} onClick={sendMessage}>
                <img src={pointImg} alt="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Counseling;
