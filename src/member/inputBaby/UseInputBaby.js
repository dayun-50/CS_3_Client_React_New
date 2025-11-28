import { useState, useCallback } from "react";
import useAuthStore from "../../store/useStore";
import axios from "axios";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";

function useInputBaby(inputBlocks, setInputBlocks, selectedGender, selectedBaby) {

    // 애기 시퀀스 바꿀 준비
    const getbabySeq = useAuthStore((state) => state.getbabySeq);
    const navigate = useNavigate();

    // 데이터 보낼 준비 
    const data = { name: "", gender: "", image_name: "", birth_date: "" };
    const [auth, setAuth] = useState([{ name: false, birth_date: false }]);
    const [inputCount, setInputCount] = useState([{ name: 0, birth_date: 0 }]);
    // 유효성
    const nickNameRegex = /^[가-힣0-9]{2,6}$/ // 닉네임 한글 2~6글자

    // 날짜 선택 기점 잡아주기
    const today = new Date();
    // 오늘 날짜
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    // 어제 날짜
    const yesterdayDate = new Date(today); // 오늘 날짜 복사
    yesterdayDate.setDate(today.getDate() + 1);

    const yYear = yesterdayDate.getFullYear();
    const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
    const yesterdayString = `${yYear}-${yMonth}-${yDay}`;

    // 성별/이미지 변경 시 inputBlocks 업데이트 함수
    const syncGenderAndImage = useCallback(() => {
        setInputBlocks(prevBlocks => {
            return prevBlocks.map(block => ({
                ...block,
                gender: selectedGender,
                image_name: selectedBaby,
            }));
        });
    }, [selectedGender, selectedBaby, setInputBlocks]);


    // 핸들러 준비
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        setInputBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks[index] = {
                ...newBlocks[index],
                [name]: value,
            };
            return newBlocks;
        });

        if (name === "name") {
            const isValid = nickNameRegex.test(value);

            setAuth(prev => {
                const newAuth = [...prev];
                newAuth[index] = { ...newAuth[index], name: isValid };
                return newAuth;
            });
        }

        if (name === "birth_date") {
            const isValid = value ? true : false;

            setAuth(prev => {
                const newAuth = [...prev];
                newAuth[index] = { ...newAuth[index], birth_date: isValid };
                return newAuth;
            });
        }

        if (name === "name" || name === "birth_date") {
            setInputCount(prev => {
                const newBlocks = [...prev];
                newBlocks[index] = {
                    ...newBlocks[index],
                    [name]: 1,
                };
                return newBlocks;
            });

        }

    }

    // 완료 버튼 클릭시
    const handleComplete = () => {
        const allValid = auth.every(block => block.name && block.birth_date);

        const allDataFilled = inputBlocks.every(block =>
            block.name && block.birth_date && block.gender && block.image_name
        );

        if (!allValid || !allDataFilled) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        console.log(inputBlocks);

        caxios.post("/baby/insert", inputBlocks)
            .then(resp => {
                getbabySeq(resp.data);
                navigate("/");
            })
            .catch(err => console.log(err));
    }

    // 엔터
    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

    return {
        data, auth, inputCount, todayString, yesterdayString,
        handleChange, handleComplete,
        syncGenderAndImage, handleLoginKeyUp
    }
}
export default useInputBaby;