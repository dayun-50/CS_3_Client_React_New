import { useEffect, useState } from "react";
import { caxios } from "../../../config/config";
import useAuthStore from "../../../store/useStore";
import { BABY_CHECKLIST, FETAL_CHECKLIST } from "../../checkListIndex/prenatalList/checklistData"; // 체크리스트 import

function UseBabyCheckList() {
    const [data, setData] = useState([]);
    const [rendering, setRendering] = useState(false);
    const babySeq = useAuthStore(state => state.babySeq);

    const findTitleByTestCode = (test_code) => {
        const allChecks = [...BABY_CHECKLIST, ...FETAL_CHECKLIST]
            .flatMap(group => group.checks);
        const matched = allChecks.find(item => item.id === test_code);
        return matched ? matched.title : test_code;
    };

    useEffect(() => {
        caxios.get("/user/eventList", { params: { baby_seq: babySeq } })
            .then(resp => {
                const processed = resp.data.map(item => {
                    const createdDate = new Date(item.created_at);
                    const todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);

                    const diffTime = createdDate.setHours(0, 0, 0, 0) - todayDate.getTime();
                    let badge;
                    if (diffTime === 0) {
                        badge = "D-Day";
                    } else if (diffTime < 0) {
                        const diffDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                        badge = `D + ${diffDays}`;
                    } else {
                        const diffDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                        badge = `D - ${diffDays}`;
                    }

                    return {
                        ...item,
                        type: createdDate <= todayDate ? "past" : "future",
                        buttonText: createdDate <= todayDate ? "완료" : "예약취소",
                        text: findTitleByTestCode(item.test_code),
                        date: item.created_at,
                        badge
                    };
                });

                setData(processed);
            })
    }, [babySeq, rendering]);

    const handleClick = (id) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("예약 일정을 취소하시겠습니까?")) return;
        caxios.post("/user/eventDelete", { baby_seq: babySeq, test_code: id })
            .then(resp => setRendering(prev => !prev))
    }

    return { data, handleClick };
}

export default UseBabyCheckList;
