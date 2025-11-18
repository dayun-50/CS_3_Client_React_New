import { useState } from "react";
import { caxios } from "../../config/config";

function useSignup(navigate) {

    // 값 받을 준비
    const [data, setData] = useState({
        email: "", emailAuth: "", id: "", nickName: "", pw: "", phone1: "", phone2: "",
        parentType: "", birthDate: "", code: ""
    });
    // 이메일 인증 서버 코드
    const [serverAuthCode, setServerAuthCode] = useState('');
    // 가족코드 없음 체크란 상태변수
    const [isNoCode, setIsNoCode] = useState(false);

    // 유효성 및 빈 문자열 확인 상태함수
    const [regexAuth, setRegexAuth] = useState({
        email: false, emailAuth: false, id: false, idChack: false, nickName: false, nickNameChack: false, pw: false,
        phone1: false, phone2: false, parentType: false, birthDate: false, code: false
    });

    // css 카운트... 흑흑
    const [inputCount, setInputCount] = useState({
        email: 0, emailAuth: 0, id: 0, nickName: 0, pw: 0,
        phone1: 0, phone2: 0, birthDate: 0, code: 0
    });

    // 유효성 검사 준비
    const regexMap = {
        id: /^[a-z0-9]{5,}$/, // 소문자+숫자 최소 5글자 이상
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // e-mail 정규식(영서띠가보내줌)
        nickName: /^[가-힣0-9]{2,6}$/, // 닉네임 한글 2~6글자
        pw: /^[a-zA-Z0-9!@#$%^&*()]{6,}$/, // 대소문자,숫자,특수문자 최소 6글자 이상
        phone1: /^\d{4}$/, // 전화번호 4자씩 끊어서 검사할거라 4만함
        phone2: /^\d{4}$/, // 전화번호 4자씩 끊어서 검사할거라 4만함
        code: /^[A-Z0-9]{5}$/ // 가족코드 대문자+숫자 랜덤 5글자
    };

    // 전화번호 입력창 정수만 입력하게 막는 로직
    const handleIntegerInput = (e) => {
        if (e.data === null) return;
        if (!/^\d+$/.test(e.data)) { e.preventDefault(); }
    }

    // 핸들러
    const hendleChange = (e) => {
        const { name, value } = e.target;
        setInputCount(prev => ({ ...prev, [name]: 1 })); // 한번이상 입력했을시에만 유효성들어가게끔
        const trimmedValue = value.trim();
        setData(prev => ({ ...prev, [name]: value }));
        const regex = regexMap[name];

        if (name === "id") { setRegexAuth(prev => ({ ...prev, idChack: false })) }
        if (name === "nickName") { setRegexAuth(prev => ({ ...prev, nickNameChack: false })) }

        const isValid = regex ? regex.test(trimmedValue) : false;
        let finalIsValid = isValid;

        if (name === "parentType" || name === "birthDate"){
            finalIsValid = value ? true : false;
        }
        if (name === "emailAuth") {
            finalIsValid = (trimmedValue == serverAuthCode);
        }

        setRegexAuth(prev => ({ ...prev, [name]: finalIsValid }));
    }

    // 이메일 인증 버튼 클릭시 
    const emailAuthClick = () => {
        if (!data.email || !regexAuth.email) { alert("알맞은 이메일을 입력해주세요."); return; }

        caxios.post("/emailCheck", { email: data.email })
            .then(resp => {
                alert("이메일 인증번호 발송 완료");
                setServerAuthCode(resp.data);
            })
            .catch(err => console.log(err));
    }

    // id, nickName 중복검사 클릭
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
            .catch(err => console.log(err));
    }

    // 가족 코드 없음 체크란 클릭시 css 먹일려고 상태변수 전환
    const handleCheckbox = (e) => {
        const checked = e.target.checked;
        setIsNoCode(checked);
        if (checked) {
            setData({ ...data, code: "" }); // 체크되면 code를 null로
            setRegexAuth(prev => ({ ...prev, code: true }));
        }
    }

    // 완료 클릭시 insert 요청
    const handleComplete = () => {
        const isAllValid = Object.values(regexAuth).every(value => value === true);
        console.log(isAllValid);
        console.log("adf",regexAuth);
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
            nickname: data.nickName,
            parent_role: data.parentType,
            birth_date: data.birthDate,
            family_code: data.code
        };

        caxios.post("/user/signup", userDTO)
            .then(resp=>{
                alert("회원가입 완료! 로그인 화면으로 돌아갑니다");
                navigate("/login");
            })
            .catch(err => console.log(err))
    }

    return {
        data, regexAuth, inputCount, isNoCode,
        chackClick, emailAuthClick, handleComplete,
        hendleChange, handleIntegerInput, handleCheckbox
    }

}
export default useSignup;