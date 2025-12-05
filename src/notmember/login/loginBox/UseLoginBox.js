import { useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";
import { useNavigate } from "react-router-dom";
import { connectWebSocket, sendMessage } from "common/webSocket/connectWebSocket";

function useLoginBox(alerts, setAlerts) {
    // 로그인 준비
    const { login, getbabySeq, setBabyDueDate, setNewAlerts } = useAuthStore((state) => state);
    const navigate = useNavigate();

    // 값 받을 준비
    const [data, setData] = useState({ id: "", pw: "" });
    // 로그인 실패 css 상태변수
    const [authAlert, setauthAlert] = useState(false);

    // 핸들러
    const handleChange = (e) => {
        setauthAlert(prev => false);
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    // 로그인 버튼 클릭시
    const handleComplete = () => {
        if (!data.id || !data.pw) {
            alert("아이디와 비밀번호 모두 입력해주세요.");
            return;
        }

        caxios.post("/user/login", { user_id: data.id, password: data.pw })
            .then(resp => {
                console.log(resp.data, "로그인 성공");
                const babyseq = Number(resp.data.babySeq);
                login(resp.data.token, data.id);
                getbabySeq(babyseq);
                
                setBabyDueDate(resp.data.babyDueDate);
                if (babyseq == 0) {
                    navigate("/chooseType");
                } else {
                    navigate("/");

                }
            })
            .catch(err => {
                alert("아이디 또는 비밀번호가 일치하지않습니다.");
                setData(prev => ({ ...prev, pw: "" }));
                setauthAlert(prev => !prev);
                console.log(err);
            });
    }

    // 엔터 클릭시
    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

    return {
        data, authAlert, handleChange, handleComplete, handleLoginKeyUp
    }
}
export default useLoginBox;