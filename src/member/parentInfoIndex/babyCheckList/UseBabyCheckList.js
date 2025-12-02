import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";
import { BABY_CHECKLIST, FETAL_CHECKLIST } from "../../checkListIndex/prenatalList/checklistData"; // 체크리스트 import

function UseBabyCheckList() {
    const [data, setData] = useState([]);
    const [rendering, setRendering] = useState(false);
    const babySeq = useAuthStore(state => state.babySeq);

    // test_code -> title 매핑 함수
    const findTitleByTestCode = (test_code) => {
        const allChecks = [...BABY_CHECKLIST, ...FETAL_CHECKLIST]
            .flatMap(group => group.checks); // 모든 체크 항목 펼치기
        const matched = allChecks.find(item => item.id === test_code);
        return matched ? matched.title : test_code; // 없으면 test_code 그대로
    };

    useEffect(() => {
        caxios.get("/user/eventList", { params: { baby_seq: babySeq } })
            .then(resp => {
                const processed = resp.data.map(item => {
                    const createdDate = new Date(item.created_at);
                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    const diffTime = createdDate - todayDate;
                    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));

                    return {
                        ...item,
                        type: createdDate <= todayDate ? "past" : "future",
                        buttonText: createdDate <= todayDate ? "완료" : "예약취소",
                        text: findTitleByTestCode(item.test_code), // test_code에 맞는 title
                        date: item.created_at,
                        badge: createdDate <= todayDate ? `D + ${diffDays}` : `D - ${diffDays}` // 필요에 따라 수정 가능
                    };
                });

                setData(processed);
            })
            .catch(err => console.error(err));
    }, [babySeq, rendering]);

    const handleClick = (id) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("예약 일정을 취소하시겠습니까?")) return;
        caxios.post("/user/eventDelete", { baby_seq: babySeq, test_code: id })
            .then(resp => setRendering(prev => !prev))
            .catch(err => console.log(err));
    }

    return { data, handleClick };
}

export default UseBabyCheckList;
