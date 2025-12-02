import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";

function useBabyInfo(isEditing, selectedGender, setSelectedGender, setIsEditing) {
    const babySeq = sessionStorage.getItem("babySeq");
    const { id, setBabyDueDate } = useAuthStore((state) => state.id);
    const [data, setData] = useState({});
    const [regex, setRegex] = useState({
        name: true, birth_date: true
    });
    const [inputCount, setInputCount] = useState({
        name: 0, birth_date: 0
    });

    // 유효성
    const nameRegex = /^[가-힣0-9]{2,6}$/ // 닉네임 한글 2~6글자

    // 오늘 날짜 기준 -7일
    const today = new Date();
    today.setDate(today.getDate() - 7); // 오늘 기준 -7일
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 태어난 날짜 기준 -7일
    let birthMinus7String = '';
    if (data.birth_date) {
        const birth_date = new Date(data.birth_date); // "YYYY-MM-DD"
        birth_date.setDate(birth_date.getDate() - 7); // -7일
        birthMinus7String = `${birth_date.getFullYear()}-${String(birth_date.getMonth() + 1).padStart(2, '0')}-${String(birth_date.getDate()).padStart(2, '0')}`;
    }

    useEffect(() => {
        caxios.get("/baby/babyMypage", {
            params: { baby_seq: babySeq }
        })
            .then(resp => {
                console.log(resp.data);

                // family_code 계산
                const processedData = {
                    ...resp.data,
                    family_code: resp.data.family_code / 1000
                };

                setData(processedData);
                setSelectedGender(processedData.gender);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id, isEditing, babySeq]);

    // 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        setInputCount(prev => ({ ...prev, [name]: 1 }));
        if (name === "name") {
            setRegex(prev => ({ ...prev, [name]: nameRegex.test(value) }));
        } else {
            setRegex(prev => ({ ...prev, [name]: value ? true : false }));
        }
    }

    // 수정 완료버튼
    const handleSave = () => {
        console.log("이얍!", data);
        console.log("으아ㅣㅇ", regex);
        if (!isEditing) return;

        const isAllValid = Object.values(regex).every(value => value === true);
        if (!isAllValid) { alert("올바른 입력값을 입력해주세요."); return; }

        const BabyDTO = {
            baby_seq: babySeq,
            name: data.name,
            gender: selectedGender,
            birth_date: data.birth_date
        };

        caxios.post("/baby/babypageUpdate", BabyDTO)
            .then(resp => {
                setIsEditing(false);
                sessionStorage.setItem("babyDueDate", data.birth_date);
                setBabyDueDate(data.birth_date);
            })
            .catch(err => console.log(err));
    }


    return {
        data, todayString, birthMinus7String, regex, inputCount,
        handleChange, handleSave, setData
    }
}
export default useBabyInfo;