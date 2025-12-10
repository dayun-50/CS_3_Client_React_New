import { useState } from "react";
import { caxios } from "../../config/config";

function useSignup(navigate) {

    const [data, setData] = useState({
        email: "", emailAuth: "", id: "", nickname: "", pw: "", phone1: "", phone2: "",
        parentType: "", birthDate: "", code: ""
    });
    const [serverAuthCode, setServerAuthCode] = useState('');
    const [isNoCode, setIsNoCode] = useState(false);

    const [regexAuth, setRegexAuth] = useState({
        email: false, emailAuth: false, id: false, idChack: false, nickname: false, nicknameChack: false, pw: false,
        phone1: false, phone2: false, parentType: false, birthDate: false, code: false
    });

    const [inputCount, setInputCount] = useState({
        email: 0, emailAuth: 0, id: 0, nickname: 0, pw: 0,
        phone1: 0, phone2: 0, birthDate: 0, code: 0
    });

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    const regexMap = {
        id: /^[a-z0-9]{5,}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        nickname: /^[가-힣0-9]{2,6}$/,
        pw: /^[a-zA-Z0-9!@#$%^&*()]{6,}$/,
        phone1: /^\d{4}$/,
        phone2: /^\d{4}$/,
        code: /^[A-Z0-9]{5}$/
    };

    const handleIntegerInput = (e) => {
        if (!/^\d+$/.test(e.data)) { e.preventDefault(); }
    }

    const hendleChange = (e) => {
        const { name, value } = e.target;
        setInputCount(prev => ({ ...prev, [name]: 1 }));
        const trimmedValue = value.trim();
        setData(prev => ({ ...prev, [name]: value }));
        const regex = regexMap[name];

        if (name === "id") { setRegexAuth(prev => ({ ...prev, idChack: false })) }
        if (name === "nickname") { setRegexAuth(prev => ({ ...prev, nicknameChack: false })) }

        const isValid = regex ? regex.test(trimmedValue) : false;
        let finalIsValid = isValid;

        if (name === "parentType" || name === "birthDate") {
            finalIsValid = value ? true : false;
        }
        if (name === "emailAuth") {
            finalIsValid = (trimmedValue == serverAuthCode);
        }

        setRegexAuth(prev => ({ ...prev, [name]: finalIsValid }));
    }

    const emailAuthClick = () => {
        if (!data.email || !regexAuth.email) { alert("알맞은 이메일을 입력해주세요."); return; }

        caxios.post("/emailCheck", { email: data.email })
            .then(resp => {
                alert("이메일 인증번호 발송 완료");
                setServerAuthCode(resp.data);
            });
    }

    const chackClick = (e) => {
        const type = e.target.name;
        const name = type === "idChack" ? "아이디" : "닉네임";
        const key = type === "idChack" ? "user_id" : "nickname";

        if (!data[type.replace("Chack", "")] || !regexAuth[type.replace("Chack", "")]) { alert(`알맞은 ${name}을(를) 입력해주세요.`); return; }

        caxios.post(`/user/${type}`, { [key]: data[type.replace("Chack", "")] })
            .then(resp => {
                if (resp.data > 0) {
                    alert(`사용중인 ${name}입니다.`);
                    setData(prev => ({ ...prev, [type]: "" }));
                } else {
                    alert(`사용가능한 ${name}입니다.`);
                    setRegexAuth(prev => ({ ...prev, [type]: true }))
                }
            })
    }

    const handleCheckbox = (e) => {
        const checked = e.target.checked;
        setIsNoCode(checked);
        if (checked) {
            setData({ ...data, code: "" });
            setRegexAuth(prev => ({ ...prev, code: true }));
        }
    }

    const handleComplete = () => {
        const isAllValid = Object.values(regexAuth).every(value => value === true);
        console.log(isAllValid);
        console.log("adf", regexAuth);
        if (!isAllValid) {
            alert("모든 입력창에 알맞은 값을 입력해주세요 :)");
            return;
        }
        const contact = `010${data.phone1}${data.phone2}`;
        const userDTO = {
            user_id: data.id,
            email: data.email,
            password: data.pw,
            contact: contact,
            nickname: data.nickname,
            parent_role: data.parentType,
            birth_date: data.birthDate,
            family_code: data.code
        };

        caxios.post("/user/signup", userDTO)
            .then(resp => {
                alert("회원가입 완료! 로그인 화면으로 돌아갑니다");
                navigate("/login");
            })
    }

    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

    return {
        data, regexAuth, inputCount, isNoCode, todayString,
        chackClick, emailAuthClick, handleComplete, handleLoginKeyUp,
        hendleChange, handleIntegerInput, handleCheckbox
    }

}
export default useSignup;