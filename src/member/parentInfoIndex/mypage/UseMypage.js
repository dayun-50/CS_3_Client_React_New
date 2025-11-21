import { useEffect, useState } from "react";
import useAuthStore from "../../../store/useStore";
import { caxios } from "../../../config/config";

function useMypage(isEditing, setIsEditing) {
    const { getbabySeq, id } = useAuthStore((state) => state);
    const [data, setData] = useState({});
    // 이메일 인증 서버 코드
    const [serverAuthCode, setServerAuthCode] = useState('');
    const [regexAuth, setRegexAuth] = useState({
        email: true, emailAuth: false, nickname: true, nickNameChack: true,
        phone1: true, phone2: true
    });
    const regexMap = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // e-mail 정규식(영서띠가보내줌)
        nickname: /^[가-힣0-9]{2,6}$/, // 닉네임 한글 2~6글자
        phone1: /^\d{4}$/, // 전화번호 4자씩 끊어서 검사할거라 4만함
        phone2: /^\d{4}$/ // 전화번호 4자씩 끊어서 검사할거라 4만함
    };
    const [inputCount, setInputCount] = useState({
        email: 0, emailAuth: 0,
        nickname: 0, phone1: 0, phone2: 0
    });

    useEffect(() => {
        caxios.get("/user/mypage")
            .then(resp => {
                console.log(resp.data);
                const phone1 = resp.data.contact.substring(3, 7);
                const phone2 = resp.data.contact.substring(7);
                setData(prev => ({ ...resp.data, phone1, phone2 }));

            })
            .catch(err => console.log(err));
    }, [id, isEditing]);

    // 핸들러 
    const hendleChange = (e) => {
        if (!isEditing) return;

        const { name, value } = e.target;

        if (name === "nickname") { setRegexAuth(prev => ({ ...prev, nickNameChack: false })) }
        // 전화번호 입력 숫자만 허용
        if (name === "phone1" || name === "phone2") {
            if (!/^\d*$/.test(value)) return; // 숫자 아니면 무시
        }
        setInputCount(prev => ({ ...prev, [name]: 1 }));
        setData(prev => ({ ...prev, [name]: value }));

        const regex = regexMap[name];
        const isValid = regex ? regex.test(value) : false;
        let finalIsValid = isValid;
        if (name === "emailAuth") {
            finalIsValid = (value == serverAuthCode);
        }
        setRegexAuth(prev => ({ ...prev, [name]: finalIsValid }));
    }

    // 닉네임 중복검사 버튼
    const chackClick = () => {
        if (!regexAuth.nickname) { alert("올바른 입력값(한글 2~6자)을 입력해주세요"); return; }
        caxios.post("/user/nickNameChack", { nickname: data.nickname })
            .then(resp => {
                if (resp.data > 0) {
                    alert(`사용중인 닉네임입니다.`);
                    setData(prev => ({ ...prev, nickname: "" }));
                } else {
                    alert(`사용가능한 닉네임입니다.`);
                    setRegexAuth(prev => ({ ...prev, nickNameChack: true }));
                }
            })
            .catch(err => console.log(err));
    }

    // 이메일 인증 버튼 클릭시 
    const emailAuthClick = () => {
        if (!data.email || !regexAuth.email) { alert("알맞은 이메일을 입력해주세요."); return; }

        caxios.post("/emailCheck", { email: data.email })
            .then(resp => {
                alert("이메일 인증번호 발송 완료");
                setServerAuthCode(resp.data);
                console.log(resp.data);
            })
            .catch(err => console.log(err));
    }

    // 완료버튼
    const handleComplete = () => {
        const isAllValid = Object.values(regexAuth).every(value => value === true);
        if (!isAllValid) {
            alert("모든 입력창에 알맞은 값을 입력해주세요 :)");
            return;
        }
        const contact = `010${data.phone1}${data.phone2}`;
        const userDTO = {
            email: data.email,
            contact: contact,
            nickname: data.nickname
        };

        caxios.post("/user/mypageUdate", userDTO)
            .then(resp => {
                alert("수정완료!");
                setIsEditing(false);
            })
            .catch(err => console.log(err));
    }

    return {
        data, regexAuth, inputCount,
        hendleChange, chackClick, emailAuthClick, handleComplete
    }
}
export default useMypage;