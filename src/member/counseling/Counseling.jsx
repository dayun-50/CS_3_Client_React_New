import React, { useState, useRef, useEffect } from "react";
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

  // 컴포넌트가 처음 렌더링될 때 챗봇이 먼저 인사 메시지 전송
  useEffect(() => {
    setMessages([
      {
        text: "긴급 챗봇입니다. 무엇을 도와드릴까요?",
        sender: "other",
        time: formatTime,
        senderName: "챗봇",
        buttons: ["입덧이 심해요.", "아이가 열이 나요.", "아이가 토를 해요.", "AI 상담"]
      }
    ]);
  }, []);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (inputText.trim() === "" || isLoading) return;

    setMessages(prev => [
      ...prev,
      { text: inputText, sender: "me", time: formatTime, senderName: "나" }
    ]);

    // 로딩 메시지 잠깐 늦게 켜기
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

  return (
    <div className={styles.container}>
      <div className={styles.left} onClick={onClose}></div>
      <div className={styles.right}>
        <div className={styles.up}>
          <div className={styles.oneonenine}>긴급 상담</div>
        </div>

        <div className={styles.down}>
          {/* 메시지 표시 영역 */}
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
                          backgroundColor: isMe ? "#FFF4D6" : "#D6F0FF",
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
                        <span>{msg.text}</span>

                        {!isMe && msg.buttons && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {msg.buttons.map((btnText, i) => (
                              <button
                                key={i}
                                onClick={selectBtn}
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  border: "1px solid #808080",
                                  background: "#fff",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  whiteSpace: "normal"
                                }}
                              >
                                {btnText}
                              </button>
                            ))}
                          </div>
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
                      backgroundColor: "#D6F0FF",
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
    </div>
  );
};

export default Counseling;
