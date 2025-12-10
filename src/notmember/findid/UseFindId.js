import { useState } from "react";
import { caxios } from "../../config/config";

function useFindId(setIsCompleted) {
    const [data, setData] = useState({
        email: "", code: ""
    });

    const [serverAuthCode, setServerAuthCode] = useState('');

    const [regexAuth, setRegexAuth] = useState({
        email: false, code: false
    });

    const [inputCount, setInputCount] = useState({
        email: 0, code: 0
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputCount(prev => ({ ...prev, [name]: 1 }));
        setData(prev => ({ ...prev, [name]: value }));
        setRegexAuth(prev => {
            let newAuth = { ...prev };
            if (name === "email") {
                newAuth.email = emailRegex.test(value);
                setRegexAuth(prev=>({...prev, code : false}));
            } else if (name === "code") {
                newAuth.code = serverAuthCode ? (value == serverAuthCode) : false;
            }
            return newAuth;
        });
    }

    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

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
                setServerAuthCode(resp.data);
            })
            .catch(err => {
                alert("인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
            });
    }

    // 완료 버튼
    const handleComplete = () => {
        if (!data.email || !data.code) {
            alert("이메일과 인증 코드를 모두 입력해주세요.");
            return;
        }
        const isAllValid = Object.values(regexAuth).every(value => value === true);

        if (!isAllValid) {
            alert("이메일 주소가 유효하지 않거나 인증 코드가 일치하지 않습니다.");
            return;
        }

        caxios.post("/user/pindIdByEmail", { email: data.email })
            .then(resp => {
                if (resp.data) {
                    setIsCompleted(resp.data);
                }else{
                    setIsCompleted("존재하지 않는 회원입니다.");
                }
            })
    }

    return {
        data, regexAuth, inputCount, handleChange, handleLoginKeyUp, emailAuthClick, handleComplete
    }
}
export default useFindId;