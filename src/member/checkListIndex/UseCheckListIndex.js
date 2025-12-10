import { useEffect, useState } from "react";
import useAuthStore from "../../store/useStore";
import { caxios } from "../../config/config";

function UseCheckListIndex() {
    const { babySeq, getbabySeq, id } = useAuthStore((state) => state);
    const [babyData, setBabyData] = useState({});

    useEffect(() => {
        if (!babySeq) return;
        caxios.get("/checkList/getBabyData", { params: { baby_seq: babySeq } })
            .then(resp => {
                setBabyData(resp.data);
            })
    }, [babySeq])

    return {
        babyData
    }
}
export default UseCheckListIndex;