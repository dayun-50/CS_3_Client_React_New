import { useState } from "react";
import useAuthStore from "../../../store/useStore";
import { caxios } from "../../../config/config";

function UsePrenatalList(setChecklist, setIsModalOpen, setCheckClicked, selectedCheck) {
    const babySeq = useAuthStore((state) => state.babySeq);

    const [data, setData] = useState({
        baby_seq: babySeq,
        test_code: "",
        is_checked: "",
        created_at: ""
    });

    const handelChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "date") {
            setData((prev) => ({ ...prev, created_at: value }));
        } else if (name === "checkbox") {
            setData((prev) => {
                let newData = { ...prev, is_checked: checked ? "Y" : "N" };

                if (checked) {
                    setCheckClicked(true);

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const selectedDate = new Date(prev.created_at);
                    selectedDate.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        newData.created_at = "";
                    }
                } else {
                    setCheckClicked(false);
                }

                return newData;
            });
        }
    };

    const dataInsert = (checkId, onSuccess) => {
        const newData = { ...data, baby_seq: babySeq, test_code: checkId };
        const hasEmpty = Object.values(newData).some((value) => value === "");
        if (hasEmpty) {
            alert("모든 값을 입력해주세요.");
            return;
        }

        caxios
            .post("/checkList/insert", newData)
            .then(() => {
                setChecklist(prev =>
                    prev.map(section => ({
                        ...section,
                        checks: section.checks.map(c =>
                            c.id === checkId
                                ? {
                                    ...c,
                                    isDone: true,
                                    date: newData.created_at,
                                    is_checked: newData.is_checked
                                }
                                : c
                        )
                    }))
                );
                setIsModalOpen(false);
                setCheckClicked(false);
                if (onSuccess) onSuccess();
            })
    };

    const dataDelect = (checkId) => {
        if (!babySeq || !checkId) {
            alert("데이터 전송중 오류발생");
            return;
        }

        const deleteData = { ...data, baby_seq: babySeq, test_code: checkId };
        caxios.post("/checkList/delete", deleteData)
            .then(resp => {
                alert("삭제 완료");
                setChecklist(prev =>
                    prev.map(section => ({
                        ...section,
                        checks: section.checks.map(c =>
                            c.id === checkId
                                ? { ...c, isDone: false, date: "", is_checked: "" }
                                : c
                        )
                    }))
                );

                setData(prev => ({
                    ...prev,
                    test_code: "",
                    is_checked: "",
                    created_at: ""
                }));
            })
    };

    const selectList = () => {
        caxios
            .get("/checkList/selectList", { params: { baby_seq: babySeq } })
            .then((resp) => {
                setChecklist(prev =>
                    prev.map(section => ({
                        ...section,
                        checks: section.checks.map(check => {
                            const found = resp.data.find(item => item.test_code === check.id);
                            return {
                                ...check,
                                date: found ? found.created_at : "",
                                isDone: !!found,
                                ...(found?.is_checked === "Y" && { is_checked: "Y" })
                            };
                        })
                    }))
                );
            })
    };

    return { data, setData, handelChange, dataInsert, dataDelect, selectList };
}

export default UsePrenatalList;
