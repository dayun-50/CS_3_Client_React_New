import { all } from "axios";
import {
    Milk,
    Droplets,
    Soup,
    Moon,
    Thermometer,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";


// toilet 세부 레이블
export const recordLabelMap = {
    "toilet/pee": "소변",
    "toilet/poop": "대변",
};

export function UseEverydayDetail({ currentDate, setCurrentDate, fetchData }) {
    // 타입별 아이콘과 색상 매핑
    const typeMap = {
        전체: { color: "#f0d827" },

        분유: { icon: Milk, color: "#ff8cb3", label: "분유" },
        이유식: { icon: Soup, color: "#7adf80", label: "이유식" },
        수면: { icon: Moon, color: "#7abaff", label: "수면" },
        체온: { icon: Thermometer, color: "#ff7a7a", label: "체온" },

        // toilet 공통 부모 타입
        배변: { icon: Droplets, color: "#ffb84d", label: "배변" },
    };

    const reverseTypeMap = {
        전체: "all",
        분유: "milk",
        배변: "toilet",
        이유식: "baby_food",
        수면: "sleep",
        체온: "temperature",
    };



    // const typeMap = {
    //     전체: { color: "#f0d827" },
    //     분유: { icon: Milk, color: "#ff8cb3", label: "분유" },
    //     이유식: { icon: Soup, color: "#7adf80", label: "이유식" },
    //     수면: { icon: Moon, color: "#7abaff", label: "수면" },
    //     체온: { icon: Thermometer, color: "#ff7a7a", label: "체온" },

    //     // 배변 공통 타입
    //     배변: { icon: Droplets, color: "#ffb84d", label: "배변" }
    // };

    // // const typeMap = {
    // //     전체: { color: "#f0d827" },
    // //     분유: { icon: Milk, color: "#ff8cb3" },
    // //     배변: { icon: Droplets, color: "#ffb84d" },
    // //     이유식: { icon: Soup, color: "#7adf80" },
    // //     수면: { icon: Moon, color: "#7abaff" },
    // //     체온: { icon: Thermometer, color: "#ff7a7a" },
    // // };
    // const reverseTypeMap = {
    //     전체: "all",
    //     분유: "milk",
    //     배변: "toilet",
    //     이유식: "baby_food",
    //     수면: "sleep",
    //     체온: "temperature",
    // };


    //------------------------------------------------------------상태변수 모음
    //필터버튼 관련
    const [activeType, setActiveType] = useState("전체"); // 디폴트 전체

    //모달 관련
    const [showModal, setShowModal] = useState(false);
    //const [typeToAdd, setTypeToAdd] = useState("");

    const [targetDayData, setTargetDayData] = useState([]);// 카드 데이터 배열


    //수정중일때
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);

    //--------------------------------------------------------------클릭 함수
    const openModalForNewLog = (type) => { // 모달 열기 핸들러
        //setTypeToAdd(type);
        setShowModal(true);
    };
    const closeModal = () => {
        setEditData(null); //수정모드 값 초기화
        setEditMode(false); //수정모드 값 초기화
        setShowModal(false);// 모달 닫기 핸들러
    }
    const handleTypeClick = (type) => {// 타입 필터 클릭 핸들러
        setActiveType(type);
    };

    const handleUpdate = (item) => {
        const baseType = item.record_type.split("/")[0];// record_type → activeType 찾기

        const mappedType =
            baseType === "toilet"
                ? "배변"
                : Object.keys(reverseTypeMap).find(
                    (k) => reverseTypeMap[k] === baseType
                );

        setActiveType(mappedType);
        setEditMode(true);// 수정 모드 ON
        setEditData(item);// 수정할 데이터 저장
        setShowModal(true);
    };

    //-----------------------------------------------------------------함수
    const moveDate = (plusOrMinus) => {//날짜 이동 함수
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + plusOrMinus);
        // 오늘 넘어가면 안 됨
        if (newDate > new Date()) {
            alert("오늘 이후 날짜로는 이동할 수 없습니다.");
            return;
        }
        setCurrentDate(newDate);
    };
    //----------------------------------------------------------------유즈이펙트
    useEffect(() => {
        const load = async () => {
            const formattedDate = currentDate.toLocaleDateString("en-CA", {
                timeZone: "Asia/Seoul",
            });
            const result = await fetchData(reverseTypeMap[activeType], formattedDate);

            console.log("활성 타입:", result);

            const rDTOList = result.rDTOList || [];
            console.log("필터된 디테일 데이터:", rDTOList);

            setTargetDayData(rDTOList);
        };

        load();
    }, [activeType, currentDate]);


    return {

        moveDate,
        typeMap,
        activeType,
        handleTypeClick,
        openModalForNewLog,
        closeModal,
        showModal,
        //typeToAdd,
        targetDayData,
        reverseTypeMap,
        setTargetDayData,
        handleUpdate,
        editMode,
        setEditMode,
        editData,
        setEditData
    }
}