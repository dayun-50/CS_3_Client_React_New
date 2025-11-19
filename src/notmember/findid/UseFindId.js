import { useState } from "react";
import { caxios } from "../../config/config";

function useFindId(setIsCompleted) {
    // data 상태는 사용자 입력값만 관리
    const [data, setData] = useState({
        email: "", code: ""
    });

    // 서버에서 받은 코드는 별도 상태로 관리
    const [serverAuthCode, setServerAuthCode] = useState('');

    // 정규식 및 일치 조건 상태변수
    const [regexAuth, setRegexAuth] = useState({
        email: false, code: false
    });

    // 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // input 핸들러 
    const handleChange = (e) => {
        const { name, value } = e.target;

        setData(prev => ({ ...prev, [name]: value }));
        setRegexAuth(prev => {
            let newAuth = { ...prev };
            if (name === "email") {
                newAuth.email = emailRegex.test(value);
            } else if (name === "code") {
                newAuth.code = serverAuthCode ? (value == serverAuthCode) : false;
            }
            return newAuth;
        });
    }

    // 엔터 클릭시
    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

    // 인증 번호 발송 버튼
    const emailAuthClick = () => {
        if (!data.email || !regexAuth.email) {
            alert("알맞은 이메일을 입력해주세요.");
            return;
        }

        setData(prev => ({ ...prev, code: "" }));
        setRegexAuth(prev => ({ ...prev, code: false }));

        caxios.post("/emailCheck", { email: data.email })
            .then(resp => {
                alert("이메일 인증번호 발송 완료");
                console.log(resp.data);
                setServerAuthCode(resp.data); // 서버 코드 저장
            })
            .catch(err => {
                alert("인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
                console.error(err);
            });
    }

    // 완료 버튼
    const handleComplete = () => {
        if (!data.email || !data.code) {
            alert("이메일과 인증 코드를 모두 입력해주세요.");
            return;
        }
        console.log("aaa", regexAuth);
        const isAllValid = Object.values(regexAuth).every(value => value === true);

        if (!isAllValid) {
            alert("이메일 주소가 유효하지 않거나 인증 코드가 일치하지 않습니다.");
            return;
        }

        caxios.post("/user/pindIdByEmail", { email: data.email })
            .then(resp => {
                console.log("응앵", resp.data);
                setIsCompleted(resp.data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    return {
        data, handleChange, handleLoginKeyUp, emailAuthClick, handleComplete
    }
}
export default useFindId;