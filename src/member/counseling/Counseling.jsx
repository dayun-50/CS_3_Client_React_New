import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Counseling.module.css";
import { Send } from "lucide-react";
import useCounseling from "./useCounseling";
import { caxios } from "../../config/config";

const Counseling = ({ onClose }) => {
  const messageEndRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { selectBtn } = useCounseling(
    setInputText,
    setMessages,
    setInputDisabled
  );

  const formatTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 초기 카드 메시지
  useEffect(() => {
    setMessages([
      {
        sender: "other",
        type: "card",
        senderName: "CS",
        text: "지금 아기가 어떤 상황인가요? 상세한 정보를 제공해 주시면 맞춤형 긴급 상담을 시작할 수 있습니다.",
        buttons: [
          "입덧이 심해요.",
          "아이가 열이 나요.",
          "아이가 토를 해요.",
          "AI 상담",
        ],
        time: formatTime,
      },
    ]);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim() || isLoading) return;

    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== "card"),
      {
        sender: "me",
        type: "text",
        text: inputText,
        senderName: "나",
        time: formatTime,
      },
    ]);

    setIsLoading(true);

    caxios
      .post("/chatBoot/aiAnswer", { question: inputText })
      .then((resp) => {
        const aiAnswer = resp.data;
        setMessages((prev) => [
          ...prev,
          {
            sender: "other",
            text: aiAnswer,
            senderName: "긴급상담",
            time: formatTime,
          },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: "응답 실패. 다시 시도해주세요.",
            senderName: "시스템",
            time: formatTime,
          },
        ]);
      })
      .finally(() => setIsLoading(false));

    setInputText("");
  };

  // 스크롤 자동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages, isLoading]);


  const MessageItem = ({ msg }) => {
    if (msg.type === "card") {
      return (
        <div className={styles.cardMessageWrapper}>
          <div className={styles.cardRow}>
            <div className={styles.cardContainer}>
              <span className={styles.senderName}>{msg.senderName}</span>
              <div className={styles.cardText}>{msg.text}</div>
              <div className={styles.cardButtons}>
                {msg.buttons.map((btn, idx) => (
                  <button
                    key={idx}
                    className={styles.cardButton}
                    onClick={(e) => selectBtn(e)}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
            <span className={styles.cardTime}>{msg.time}</span>
          </div>
        </div>
      );
    }

    const isMe = msg.sender === "me";
    const isSystem = msg.sender === "system";

    return (
      <div
        className={`${styles.messageContainer} ${
          isMe
            ? styles.myMessage
            : isSystem
            ? styles.systemMessage
            : styles.otherMessage
        }`}
      >
        {!isMe && !isSystem && (
          <span className={styles.senderName}>{msg.senderName}</span>
        )}
        <div className={styles.bubbleRow}>
          <div className={styles.bubble}>{msg.text}</div>
          <span className={styles.messageTime}>{msg.time}</span>
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div className={styles.container}>
      <div className={styles.left} onClick={onClose}></div>
      <div className={styles.right} onClick={(e) => e.stopPropagation()}>

        {/* 상단 헤더 + 안내문 sticky */}
        <div className={styles.stickyTop}>
          <div className={styles.up}>
            <div className={styles.oneonenine}>긴급 상담</div>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
          <div className={styles.infoText}>
            긴급 상황에서 AI 상담을 받을 수 있는 공간입니다.
            <br />
            아기의 상태나 증상을 선택하거나 입력하여 맞춤형 상담을 시작하세요.
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className={styles.down}>
          <div className={styles.chatbody} ref={messageEndRef}>
            {messages.map((msg, idx) => (
              <MessageItem key={idx} msg={msg} />
            ))}

            {isLoading && (
              <div
                className={`${styles.messageContainer} ${styles.loadingMessage}`}
              >
                <span className={styles.senderName}>긴급상담</span>
                <div className={styles.bubbleRow}>
                  <div className={styles.loadingBubble}>
                    <div className={styles.dotFlashing}></div>
                    <div className={styles.dotFlashing}></div>
                    <div className={styles.dotFlashing}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className={styles.commentInputBox}>
            <div className={styles.inputField}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  inputDisabled
                    ? "AI 상담을 시작하면 활성화됩니다."
                    : "메시지를 입력하세요"
                }
                className={styles.inputElement}
                disabled={inputDisabled || isLoading}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
            </div>
            <button
              className={styles.submitButton}
              onClick={sendMessage}
              disabled={inputDisabled || isLoading || inputText.trim() === ""}
            >
              <Send size={24} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Counseling;
