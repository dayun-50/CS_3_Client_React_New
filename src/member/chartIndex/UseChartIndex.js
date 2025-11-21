    import { useMemo, useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { caxios } from "../../config/config";
    import { FETAL_STANDARDS } from "./FetalStandardData"; 
    import { calculateFetalWeek, calculateInfantWeek, fetalWeekStartEnd } from "../utils/pregnancyUtils";



    export const useChartIndex = (babySeq) => {
        
        
        // 1. 상태 초기화 (API 응답을 기다리는 null 상태)
        const [babyInfo, setBabyInfo] = useState(null);       // Baby DTO (EDD, Status)
        const [currentWeek, setCurrentWeek] = useState(0);    // 계산된 주차
        const [actualData, setActualData] = useState(null);   // 현재 주차의 실측 데이터 (Map)
        const [activeMenu, setActiveMenu] = useState(0);

        const menuList = [
            "전체", "몸무게", "머리직경", "머리둘레", "복부둘레", "허벅지 길이",
        ];
        

        


        //  PHASE 1: 초기 데이터 로드 및 currentWeek 계산 (EDD/Status -> Week)
        useEffect(() => {
            
    if (typeof babySeq !== 'number' || babySeq <= 0) { 
                // setCurrentWeek(28) 기본값 설정 로직 제거. 0 (로딩 상태)을 유지합니다.
                return; 
            }

            const fetchInitialState = async () => {
                try {
                    // Baby 정보 조회
                    const babyResponse = await caxios.get(`/chart/${babySeq}`);

                    // DTO 필드 추출
                    const { status, birth_date, baby_seq : seq } = babyResponse.data;
                    const birthDateStr = birth_date;  // 로직에서 사용할 날짜 변수
                    
                // 클라이언트 유틸리티 사용해서 주차 계산
                const todayStr = new Date().toISOString().split('T')[0]; // 오늘 날짜 'YYYY-MM-DD'
                let calculatedWeek;
                    
              

                if ("fetus".toLowerCase() === status.toLowerCase()) {
                    // 태아 주차 계산
                    calculatedWeek = calculateFetalWeek(birthDateStr, todayStr);
                } else {
                    // 영유아 주차 계산
                    calculatedWeek = calculateInfantWeek(birthDateStr, todayStr);
                }
                    

                    // 상태 업데이트
                    setBabyInfo({ babySeq: seq, status, birthDate: birthDateStr });
                    setCurrentWeek(calculatedWeek); 

                } catch (error) {
                    console.error("초기 데이터 로딩 오류:", error);
                    setCurrentWeek(28); // 오류 시 기본값 설정
                    setBabyInfo({ babySeq: babySeq, status: 'FETUS', birth_date: '2026-01-01' }); 
                }
            };
            
            fetchInitialState();
        }, [babySeq]); 


        //  PHASE 2: 실제 측정 데이터 조회 (DB 쿼리 전송)
        useEffect(() => {
            if (currentWeek <= 0 || !babyInfo) return; 

            const fetchActualData = async () => {
                setActualData(null); 
                try {
                    //  DB 쿼리용 시작일/종료일 계산 (클라이언트의 역할)
                    const [startDate, endDate] = fetalWeekStartEnd(babyInfo.birth_date, currentWeek);

                    const response = await caxios.get(`/chart/total`, {
                        params: { babyId: babyInfo.babySeq, 
                            week : currentWeek,
                            startDate: startDate, 
                            endDate: endDate }
                    });
                    setActualData(response.data || {}); 
                } catch (error) {
                    console.error("Actual Data 조회 실패:", error);
                    setActualData({});
                }
            };
            
            fetchActualData();
        }, [currentWeek, babyInfo]); 


        // 5. 메모이제이션된 표준 데이터 (FETAL_STANDARDS)
        const currentStandardData = useMemo(() => {
            if (currentWeek <= 0) return null;
            return FETAL_STANDARDS[currentWeek]; 
        }, [currentWeek]);


        // 6. 최종 반환 값
        return {
            menuList,
            currentWeek,
            activeMenu,
            setActiveMenu,
            currentStandardData,
            currentActualData: actualData,
        };
    };