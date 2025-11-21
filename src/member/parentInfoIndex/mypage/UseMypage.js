import { useEffect, useState } from "react";
import useAuthStore from "../../../store/useStore";
import { caxios } from "../../../config/config";

function useMypage() {
    const { getbabySeq, id } = useAuthStore((state) => state);
    const [data, setData] = useState({});

    useEffect(() => {
        caxios.get("/user/mypage")
            .then(resp => {
                console.log(resp.data);
                setData(resp.data);
            })
            .catch(err => console.log(err));
    }, [id]);


    return {
        data
    }
}
export default useMypage;