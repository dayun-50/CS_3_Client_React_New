import { caxios } from "config/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/useStore";

function UseCommonHeader() {
    const navi = useNavigate();
    const {newAlerts ,setNewAlerts} = useAuthStore(state=>state);

    const clickAlarm = (alert, setAlerts) => {
        const { type, alarm_seq, board_seq, comment_seq } = alert;
        caxios.post("/alarm/deleteAlarm", { board_seq: board_seq, comment_seq: comment_seq })
            .then(resp => {
                setAlerts(prev => prev.filter(a => a.board_seq !== board_seq ));
                if (type === "C") {
                    navi(`/board/detail?seq=${board_seq}`);
                }
                setNewAlerts(false);
            })
            .catch(err => console.log(err));
    }


    return {
        clickAlarm, newAlerts, setNewAlerts
    }
}
export default UseCommonHeader;