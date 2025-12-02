import { FETAL_STANDARDS } from '../FetalStandardData';
import { caxios } from '../../../config/config';
import { calculateFetalWeek } from '../../utils/pregnancyUtils';

/**
 * 아기 측정 데이터를 가져와서 ECharts 옵션 생성
 */
export const UseDetailChart = (activeMenu, currentWeek, menuList, standardData, babySeq, dueDate) => {
    const selectedMetricName = menuList[activeMenu];
    const metricKeyMap = { "몸무게": "EFW", "머리둘레": "HC", "머리직경": "OFD", "복부둘레": "AC", "허벅지 길이": "FL" };
    const selectedMetricKey = metricKeyMap[selectedMetricName];

    if (!selectedMetricKey || !FETAL_STANDARDS[currentWeek] || !babySeq || !dueDate) {
        return Promise.resolve({});
    }
    console.log("babySeq : " + babySeq);
    return caxios.get(`/chart/detail?babySeq=${babySeq}`)
        .then(res => {
            const records = res.data;
            const actual = {};
            const metricKeys = ["EFW", "HC", "OFD", "AC", "FL"];

            // measure_date -> 주차
            records.forEach(r => {
                const week = calculateFetalWeek(dueDate, r.measure_date);
                if (!actual[week]) actual[week] = {};
                metricKeys.forEach(typeKey => {
                    if (r[typeKey] !== undefined) {
                        actual[week][typeKey] = r[typeKey]; // Key (EFW) : Value (3.1) 저장
                    }
                });
                actual[week][r.measure_type] = r.measure_value;
            });

            const START_WEEK = 14;
            const END_WEEK = 40;
            const weeks = [];
            const avgData = [];
            const actualBabyData = [];
            let unit = FETAL_STANDARDS[START_WEEK][selectedMetricKey].unit;

            for (let week = START_WEEK; week <= END_WEEK; week++) {
                weeks.push(week);
                avgData.push(FETAL_STANDARDS[week][selectedMetricKey]?.avg ?? null);
                actualBabyData.push(actual[week]?.[selectedMetricKey] ?? null);
            }

            return {
                title: { text: `${selectedMetricName} 성장 추이 (${START_WEEK}주~${END_WEEK}주)`, left: 'center' },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        const week = params[0].name;
                        const values = params.map(p => `${p.marker} ${p.seriesName}: ${p.value} ${unit}`);
                        return `주차: ${week}주<br/>` + values.join('<br/>');
                    }
                },
                legend: { data: ['태아 표준 기록 (평균)', '내 아기 성장 기록'], bottom: 0 },
                xAxis: { type: 'category', data: weeks, name: '임신 주수 (Week)', boundaryGap: false },
                yAxis: { type: 'value', name: `측정값 (${unit})` },
                series: [
                    { name: '태아 표준 기록 (평균)', type: 'line', data: avgData, lineStyle: { color: 'green', width: 2 }, smooth: true, showSymbol: false },
                    { name: '내 아기 성장 기록', type: 'line', data: actualBabyData, lineStyle: { color: 'blue', width: 3 }, symbolSize: 8, connectNulls: true }
                ]
            };
        })
        .catch(err => {
            console.error("그래프 데이터 로딩 실패:", err);
            return {};
        });
};
