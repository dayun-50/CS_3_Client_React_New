import { useState } from "react";
import useAuthStore from "../../store/useStore";

function useChooseType(inputBlocks, setInputBlocks) {
    // 애기 시퀀스 바꿀 준비
    const getbabySeq = useAuthStore((state) => state.getbabySeq);

    // 데이터 보낼 준비 
    const data = { name: "", gender: "", image_name: "", birthDate: "" };

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

    }
    return {
        data
    }
}
export default useChooseType;