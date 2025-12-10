import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";

function useMypage(isEditing, setIsEditing) {
    const { getbabySeq, id } = useAuthStore((state) => state);
    const [data, setData] = useState({});
    const [serverAuthCode, setServerAuthCode] = useState('');
    const [regexAuth, setRegexAuth] = useState({
        email: true, emailAuth: false, nickname: true, nickNameChack: true,
        phone1: true, phone2: true
    });
    const regexMap = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        nickname: /^[가-힣0-9]{2,6}$/,
        phone1: /^\d{4}$/,
        phone2: /^\d{4}$/
    };
    const [inputCount, setInputCount] = useState({
        email: 0, emailAuth: 0,
        nickname: 0, phone1: 0, phone2: 0
    });

    useEffect(() => {
        caxios.get("/user/mypage")
            .then(resp => {
                const phone1 = resp.data.contact.substring(3, 7);
                const phone2 = resp.data.contact.substring(7);
                setData(prev => ({ ...resp.data, phone1, phone2 }));

            })
    }, [id, isEditing]);

    const hendleChange = (e) => {
        if (!isEditing) return;

        const { name, value } = e.target;

        if (name === "nickname") { setRegexAuth(prev => ({ ...prev, nickNameChack: false })) }
        if (name === "phone1" || name === "phone2") {
            if (!/^\d*$/.test(value)) return;
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
    }

    const emailAuthClick = () => {
        if (!data.email || !regexAuth.email) { alert("알맞은 이메일을 입력해주세요."); return; }

        caxios.post("/emailCheck", { email: data.email })
            .then(resp => {
                alert("이메일 인증번호 발송 완료");
                setServerAuthCode(resp.data);
            })
    }

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
    }

    return {
        data, regexAuth, inputCount,
        hendleChange, chackClick, emailAuthClick, handleComplete
    }
}
export default useMypage;