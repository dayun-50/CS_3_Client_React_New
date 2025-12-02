// src/member/utils/pregnancyUtils.js

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TOTAL_FETAL_DAYS = 280; // 40주 = 280일

/**
 * 1. 안전한 날짜 파싱: UTC 자정 기준으로 Date 객체를 생성합니다.
 */
const parseDate = (dateString) => {
    // T00:00:00Z를 붙여 UTC 기준으로 파싱하여 로컬 시간대 오차를 방지합니다.
    return new Date(dateString + 'T00:00:00Z');
};

/**
 * 두 날짜 문자열 간의 전체 일수 차이를 계산합니다.
 */
const getDayDifference = (dateA, dateB) => {
    // Math.floor를 사용하여 정확한 일수 차이만 계산합니다.
    return Math.floor((dateA.getTime() - dateB.getTime()) / MS_PER_DAY);
};


// =================================================================
// 2. 태아 주차 계산 (FETAL WEEK)
// =================================================================
/**
 * @param {string} dueDateStr - 출산 예정일 (EDD, 'YYYY-MM-DD')
 * @returns {number} 계산된 임신 주차 (1 ~ 42)
 */
export const calculateFetalWeek = (dueDateStr, measureDateStr) => {

    const dueDate = parseDate(dueDateStr);
    const measureDate = parseDate(measureDateStr);
    // 임신 시작일 (
    // Conception Start) = dueDate - 40주
    const conceptionStart = new Date(dueDate.getTime() - (TOTAL_FETAL_DAYS * MS_PER_DAY));


    // 임신 시작일로부터 측정일까지 지난 일수 계산
    let daysPassed = getDayDifference(measureDate, conceptionStart);
    console.log("일수 계산일 : " + daysPassed)
    if (daysPassed < 0) daysPassed = 0;

    // 주차 계산: (일수 / 7) + 1
    let week = Math.floor(daysPassed / 7) + 1;

    if (week < 1) week = 1;
    if (week > 42) week = 42;

    return week;
};


// =================================================================
// 3. 영유아 주차 계산 (INFANT WEEK)
// =================================================================
/**
 * @param {string} birthDateStr - 실제 출생일 ('YYYY-MM-DD')
 * @returns {number} 계산된 생후 주차 (1 ~ )
 */
export const calculateInfantWeek = (birthDateStr, measureDateStr) => {
    const birthDate = parseDate(birthDateStr);
    const measureDate = parseDate(measureDateStr);

    // 출생일로부터 측정일까지 지난 일수 계산
    let daysPassed = getDayDifference(measureDate, birthDate);

    if (daysPassed < 0) daysPassed = 0;

    // 주차 계산: (일수 / 7) + 1
    let week = Math.floor(daysPassed / 7) + 1;

    return week;
};


// =================================================================
// 4. 특정 주차의 시작일과 종료일 계산 (DB 쿼리용)
// =================================================================
/**
 * @param {string} dueDateStr - 출산 예정일 (EDD)
 * @param {number} week - 특정 주차 (예: 32)
 * @returns {[string, string]} [시작일, 종료일] (YYYY-MM-DD 형식)
 */
export const fetalWeekStartEnd = (dueDateStr, week) => {
    const dueDate = parseDate(dueDateStr);

    //  Critical Fix 1: 계산 전 유효성 검사
    if (isNaN(dueDate.getTime())) {
        console.error("Invalid Due Date provided:", dueDateStr);
        return [null, null];
    }

    // 임신 시작일 (Conception Start) 밀리초
    const conceptionStartMs = dueDate.getTime() - (TOTAL_FETAL_DAYS * MS_PER_DAY);

    // Week Start MS = Conception Start MS + (week - 1) full weeks
    const startMs = conceptionStartMs + ((week - 1) * 7 * MS_PER_DAY);
    const endMs = startMs + (6 * MS_PER_DAY);


    // Week End MS = Week Start MS + 6일
    const start = new Date(startMs); // 주차 시작일 Date 객체
    const end = new Date(endMs); // 주차 종료일 Date 객체

    //  Critical Fix 2: 최종 생성된 Date 객체가 유효한지 확인
    if (isNaN(start.getTime())) {
        console.error("Calculated Start Date is Invalid for week:", week);
        return [null, null];
    }

    // YYYY-MM-DD 포맷으로 변환 (toISOString은 UTC 기반)
    const formatDate = (date) => date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

    return [formatDate(start), formatDate(end)];
};




export const infantWeekStartEnd = (birthDateStr, week) => {
    const birthDate = parseDate(birthDateStr);

    // 1. 유효성 검사 (태아 로직과 동일)
    if (isNaN(birthDate.getTime())) {
        console.error("Invalid Birth Date provided:", birthDateStr);
        return [null, null];
    }

    // 생후 0주차 시작일은 birthDate입니다.
    // Week Start MS = BirthDate MS + (week - 1) full weeks
    // 예: 1주차 -> (1-1)*7 = 0일 추가. 시작일은 출생일
    const startMs = birthDate.getTime() + ((week - 1) * 7 * MS_PER_DAY);
    const start = new Date(startMs); // 주차 시작일 Date 객체

    // Week End MS = Week Start MS + 6일 (주차는 7일 단위)
    const endMs = startMs + (6 * MS_PER_DAY);
    const end = new Date(endMs); // 주차 종료일 Date 객체

    // 2. 최종 생성된 Date 객체가 유효한지 확인 (방어 로직)
    if (isNaN(start.getTime())) {
        console.error("Calculated Start Date is Invalid for infant week:", week);
        return [null, null];
    }

    // YYYY-MM-DD 포맷으로 변환 (toISOString은 UTC 기반)
    const formatDate = (date) => date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

    return [formatDate(start), formatDate(end)];
};