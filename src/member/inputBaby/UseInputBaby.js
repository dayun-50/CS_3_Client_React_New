import { useState, useCallback } from "react";
import useAuthStore from "../../store/useStore";
import axios from "axios";
import { caxios } from "../../config/config";
import { useNavigate } from "react-router-dom";

function useInputBaby(inputBlocks, setInputBlocks, selectedGender, selectedBaby) {
    const getbabySeq = useAuthStore((state) => state.getbabySeq);
    const navigate = useNavigate();
    const data = { name: "", gender: "", image_name: "", birth_date: "" };
    const [auth, setAuth] = useState([{ name: false, birth_date: false }]);
    const [inputCount, setInputCount] = useState([{ name: 0, birth_date: 0 }]);

    const nickNameRegex = /^[가-힣0-9]{2,6}$/

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() + 1);

    const yYear = yesterdayDate.getFullYear();
    const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
    const yesterdayString = `${yYear}-${yMonth}-${yDay}`;

    const before24M = new Date(today);
    before24M.setMonth(before24M.getMonth() - 24);

    const bYear = before24M.getFullYear();
    const bMonth = String(before24M.getMonth() + 1).padStart(2, '0');
    const bDay = String(before24M.getDate()).padStart(2, '0');
    const before24MString = `${bYear}-${bMonth}-${bDay}`;

    const syncGenderAndImage = useCallback(() => {
        setInputBlocks(prevBlocks => {
            return prevBlocks.map(block => ({
                ...block,
                gender: selectedGender,
                image_name: selectedBaby,
            }));
        });
    }, [selectedGender, selectedBaby, setInputBlocks]);


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

    const handleComplete = () => {
        const allValid = auth.every(block => block.name && block.birth_date);

        const allDataFilled = inputBlocks.every(block =>
            block.name && block.birth_date && block.gender && block.image_name
        );

        if (!allValid || !allDataFilled) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        caxios.post("/baby/insert", inputBlocks)
            .then(resp => {
                getbabySeq(resp.data);
                navigate("/");
            })
    }

    const handleLoginKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleComplete();
        }
    }

    return {
        data, auth, inputCount, todayString, yesterdayString, before24MString,
        handleChange, handleComplete,
        syncGenderAndImage, handleLoginKeyUp
    }
}
export default useInputBaby;