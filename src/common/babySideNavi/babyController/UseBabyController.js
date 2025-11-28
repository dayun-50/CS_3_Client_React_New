import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";
import { useNavigate } from "react-router-dom";

function useBabyController() {
    const { babySeq, getbabySeq, id, setBabyDueDate } = useAuthStore((state) => state);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        caxios.get("/user/babyListByMypage")
            .then(resp => {
                console.log(resp.data);
                setData(resp.data);
            })
            .catch(err => console.log(err))
    }, [babySeq, id])

    // 몇째인지 띄우는...네..
    function getKoreanOrder(num) {
        const units = ["", "첫", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"];
        const tens = ["", "열", "스물", "서른", "마흔", "쉰"];

        if (num <= 10) return units[num] + "째";
        const ten = Math.floor(num / 10);
        const unit = num % 10;
        return (tens[ten] || "") + (units[unit] || "") + "째";
    }

    // 애기 선택시 페이지 이동
    const changeBaby = (seq, date) => {
        caxios.post("/user/changeBaby", { last_baby: babySeq })
            .then(resp => {
                getbabySeq(seq);
                navigate("/babymypage");
                setBabyDueDate(date);
            })
            .catch(err => console.log(err));
    }

    return {
        data, babySeq,
        getKoreanOrder, changeBaby
    }
}
export default useBabyController;