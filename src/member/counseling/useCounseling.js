import { useEffect } from "react";
import { caxios } from "../../config/config";

function useCounseling(setInputText, setMessages, setInputDisabled) {

    const selectBtn = (e) => {
        const text = e.target.innerText;
        const now = new Date();
        const formatTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setMessages(prev => [
            ...prev,
            { text: text, sender: "me", time: formatTime, senderName: "나" }
        ]);

        if (text === "AI 상담") {
            setInputDisabled(false);
            const aiText = `AI 상담을 시작합니다.\n`+
            "흔한 증상 및 상황이 아닌경우 119 에 연락하실 바랍니다.\n"+
            "또한, 미관련 질문일 경우 답변이 어려운점 양해 부탁드립니다.";
            setMessages(prev => [
                ...prev,
                { text: aiText, sender: "other", time: formatTime, senderName: "챗봇" }
            ]);
            return;
        }

        caxios.get("/chatBoot/answer", {
            params: { trigger_text: text }
        })
            .then(resp => {
                console.log(resp.data);
                setMessages(prev => [
                    ...prev,
                    { text: resp.data.response_text, sender: "other", time: formatTime, senderName: "챗봇" }
                ]);
            })
    }

    return {
        selectBtn
    }
}
export default useCounseling;