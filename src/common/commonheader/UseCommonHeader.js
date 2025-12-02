import { caxios } from "config/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UseCommonHeader(setAlerts, setNewAlerts) {
    const navi = useNavigate();

    const clickAlarm = (alert) => {
        const { type, alarm_seq, board_seq, comment_seq } = alert;
        caxios.post("/alarm/deleteAlarm", { board_seq: board_seq, comment_seq: comment_seq })
            .then(resp => {
                setAlerts(prev => prev.filter(a => a.alarm_seq !== alarm_seq));
                if (type === "C") {
                    navi(`/board/detail?seq=${board_seq}`);
                }
                setNewAlerts(false);

            })
            .catch(err => console.log(err));
    }


    return {
        clickAlarm
    }
}
export default UseCommonHeader;