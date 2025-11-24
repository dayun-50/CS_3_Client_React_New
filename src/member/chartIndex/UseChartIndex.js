    import { useMemo, useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { caxios } from "../../config/config";
    import { FETAL_STANDARDS } from "./FetalStandardData"; 
    import { calculateFetalWeek, calculateInfantWeek, fetalWeekStartEnd, infantWeekStartEnd } from "../utils/pregnancyUtils";



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
 console.log("🟢 DEBUG — Phase1 Week 계산 결과");                   
console.log("status:", status);
console.log("birthDate:", birthDateStr);
console.log("calculatedWeek:", calculatedWeek);
console.log('Loading Condition Result:', currentWeek === 0 || actualData === null || !currentStandardData);
// UseChartIndex.js
console.log(`4. actualData:`, actualData);
console.log(`5. currentStandardData:`, currentStandardData);
console.log(`6. Loading Condition Result:`, (currentWeek === 0 || actualData === null || !currentStandardData));

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

                // 🟢 DEBUG 1: Phase 2 데이터 로딩 시작 알림
        console.log("🟢 DEBUG — Phase 2: 실제 데이터 로딩 시작. currentWeek:", currentWeek);
                try {
                let startDate, endDate;
                
                // 🚨 Final Fix: status에 따라 다른 날짜 범위 계산 유틸리티 사용
                if (babyInfo.status.toLowerCase() === 'fetus') {
                    // 1. 태아: EDD를 기준으로 주차 시작/종료일 계산
                    [startDate, endDate] = fetalWeekStartEnd(babyInfo.birthDate, currentWeek);
                } else {
                    // 2. 영유아: 생일을 기준으로 생후 주차 시작/종료일 계산
                    // 💡 infantWeekStartEnd 함수는 현재 주차(week)를 기반으로 해당 주차의 날짜 범위를 반환해야 합니다.
                    [startDate, endDate] = infantWeekStartEnd(babyInfo.birthDate, currentWeek); 
                }

                // 🚨 날짜가 null인지 최종 체크 (유효하지 않은 날짜는 전송 금지)
                if (!startDate || !endDate) {
                    console.error("DEBUG: Calculated date range is invalid. Aborting API call.");
                    setActualData({});
                    return;
                }
                
                // 3. API 호출 (유효한 날짜 전송)
                const response = await caxios.get(`/chart/total`, {
                    params: { 
                       babyId: babyInfo.babySeq, 
                        week: currentWeek, // 주차 정보는 optional하게 남겨두거나 서버에 맞춰 전송합니다.
                        startDate: startDate, 
                        endDate: endDate
                    }
                });
                // 🟢 DEBUG 2: API 응답 도착 및 setActualData 실행 직전
            console.log("🟢 DEBUG — Phase 2: API 응답 도착. 데이터 내용:", response.data);

            setActualData(response.data || {}); 
            
            // 🟢 DEBUG 3: setActualData 호출 완료 (다음 렌더링에 actualData가 채워짐)
            console.log("🟢 DEBUG — Phase 2: setActualData 호출 완료");

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