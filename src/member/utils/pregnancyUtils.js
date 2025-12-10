

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TOTAL_FETAL_DAYS = 280;

const parseDate = (dateString) => {
    return new Date(dateString + 'T00:00:00Z');
};

const getDayDifference = (dateA, dateB) => {
    return Math.floor((dateA.getTime() - dateB.getTime()) / MS_PER_DAY);
};

export const calculateFetalWeek = (dueDateStr, measureDateStr) => {

    const dueDate = parseDate(dueDateStr);
    const measureDate = parseDate(measureDateStr);
    const conceptionStart = new Date(dueDate.getTime() - (TOTAL_FETAL_DAYS * MS_PER_DAY));

    let daysPassed = getDayDifference(measureDate, conceptionStart);
    console.log("일수 계산일 : " + daysPassed)
    if (daysPassed < 0) daysPassed = 0;
    let week = Math.floor(daysPassed / 7) + 1;

    if (week < 1) week = 1;
    if (week > 42) week = 42;

    return week;
};


export const calculateInfantWeek = (birthDateStr, measureDateStr) => {
    const birthDate = parseDate(birthDateStr);
    const measureDate = parseDate(measureDateStr);
    let daysPassed = getDayDifference(measureDate, birthDate);

    if (daysPassed < 0) daysPassed = 0;

    let week = Math.floor(daysPassed / 7) + 1;

    return week;
};

export const fetalWeekStartEnd = (dueDateStr, week) => {
    const dueDate = parseDate(dueDateStr);

    if (isNaN(dueDate.getTime())) {
        console.error("Invalid Due Date provided:", dueDateStr);
        return [null, null];
    }

    const conceptionStartMs = dueDate.getTime() - (TOTAL_FETAL_DAYS * MS_PER_DAY);
    const startMs = conceptionStartMs + ((week - 1) * 7 * MS_PER_DAY);
    const endMs = startMs + (6 * MS_PER_DAY);

    const start = new Date(startMs);
    const end = new Date(endMs);

    if (isNaN(start.getTime())) {
        console.error("Calculated Start Date is Invalid for week:", week);
        return [null, null];
    }

    const formatDate = (date) => date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

    return [formatDate(start), formatDate(end)];
};


export const infantMonthStartEnd = (birthDateStr, month) => {
    const infantbirthDate = parseDate(birthDateStr);
    if (isNaN(infantbirthDate.getTime())) {
        console.error("Invalid Birth Date:", birthDateStr);
        return [null, null];
    }

    const start = new Date(infantbirthDate);
    start.setMonth(start.getMonth() + (month - 1));

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);

    const formatDate = (date) => date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    return [formatDate(start), formatDate(end)];
};