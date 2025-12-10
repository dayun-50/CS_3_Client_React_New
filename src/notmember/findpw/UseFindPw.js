import { useState } from "react";
import { caxios } from "../../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PiPassword } from "react-icons/pi";

function useFindPw(setIsCompleted) {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "", code: ""
    });

    const [serverAuthCode, setServerAuthCode] = useState('');

    const [regexAuth, setRegexAuth] = useState({
        email: false, code: false
    });

    const [inputCount, setInputCount] = useState({
        email: 0, code: 0, pw: 0
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
                setRegexAuth(prev => ({ ...prev, code: false }));
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
                    setIsCompleted(true);
                } else {
                    alert("존재하지 않은 회원 정보입니다.");
                    return;
                }
            })
    }

    const [inputpw, setInputpw] = useState("");
    const [regexAuthPw, setRegexAuthPw] = useState(false);
    const pwRegex = /^[a-zA-Z0-9!@#$%^&*()]{6,}$/

    const alertAsync = (msg) =>
        new Promise((resolve) => {
            window.alert(msg);
            resolve();
        });

    const handleChangePw = (e) => {
        const pw = e.target.value;
        setInputCount(prev => ({ ...prev, pw: 1 }));
        setRegexAuthPw(pwRegex.test(pw));
        setInputpw(pw);
    }

    const handleCompletePw = () => {
        if (!inputpw || !regexAuthPw) {
            alert("대소문자,숫자,특수문자 최소 6자 이상 입력해주세요");
            return;
        }
        caxios
            .post("/user/pindPwByEmail", { email: data.email, password: inputpw })
            .then(async (resp) => {
                if (resp.data > 0) {
                    await alertAsync("비밀번호 변경 완료!");
                    navigate("/login");
                } else {
                    await alertAsync("변경 실패. 재시도를 부탁드립니다.");
                    navigate("/findpw");
                }
            })
    }

    const handlePwKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleCompletePw();
        }
    }

    return {
        data, regexAuth, inputCount, handleChange, handleLoginKeyUp, emailAuthClick, handleComplete,
        inputpw, regexAuthPw, handleChangePw, handleCompletePw, handlePwKeyUp
    }
}
export default useFindPw;