import { FETAL_STANDARDS } from '../FetalStandardData';
import { INFANT_STANDARDS } from '../InfantStandardData';
import { caxios } from '../../../config/config';
import { calculateFetalWeek, calculateInfantWeek } from '../../utils/pregnancyUtils';

export const UseDetailChart = (activeMenu, currentWeek, menuList, standardData, babySeq, babyDueDate, isFetalMode) => {



    return caxios.get(`/chart/detail?babySeq=${babySeq}`)
        .then(res => {

            const selectedMetricName = menuList[activeMenu];
            const metricKeyMap = isFetalMode
                ? { "몸무게": "EFW", "머리둘레": "HC", "머리직경": "OFD", "복부둘레": "AC", "허벅지 길이": "FL" }
                : { "몸무게": "BW", "머리둘레": "HC", "신장": "HT" };
            const selectedMetricKey = metricKeyMap[selectedMetricName];

            const records = res.data;
            const actual = {};
            const metricKeys = Object.values(metricKeyMap);


            records.forEach(r => {
                let idx;
                if (isFetalMode) {
                    idx = calculateFetalWeek(babyDueDate, r.measure_date);
                } else {
                    idx = Math.ceil(calculateInfantWeek(babyDueDate, r.measure_date) / 4);
                }
                if (!actual[idx]) actual[idx] = {};
                metricKeys.forEach(key => {
                    if (r[key] !== undefined) actual[idx][key] = r[key];
                });
                actual[idx][r.measure_type] = r.measure_value;
            });

            const START = isFetalMode ? 14 : 1;
            const END = isFetalMode ? 40 : 25;
            const xAxis = [];
            const avgData = [];
            const actualBabyData = [];
            let unit = '';

            for (let i = START; i <= END; i++) {
                xAxis.push(i);
                actualBabyData.push(actual[i]?.[selectedMetricKey] ?? null);

                if (isFetalMode) {
                    avgData.push(FETAL_STANDARDS[i]?.[selectedMetricKey]?.avg ?? null);
                    unit = FETAL_STANDARDS[i]?.[selectedMetricKey]?.unit ?? '';
                } else {
                    avgData.push(INFANT_STANDARDS[i]?.[selectedMetricKey]?.avg ?? null);
                    unit = INFANT_STANDARDS[i]?.[selectedMetricKey]?.unit ?? '';
                }
            }

            const series = [
                { name: '표준 평균', type: 'line', data: avgData, lineStyle: { color: 'green', width: 2 }, smooth: true, showSymbol: false }
            ];

            if (actualBabyData.some(v => v !== null)) {
                series.push({
                    name: '내 아기 성장 기록',
                    type: 'line',
                    data: actualBabyData,
                    lineStyle: { color: 'blue', width: 3 },
                    symbolSize: 8,
                    connectNulls: true
                });
            }

            return {
                title: { text: `${selectedMetricName} 성장 추이`, left: 'center' },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        const idx = params[0].name;
                        const values = params.map(p => `${p.marker} ${p.seriesName}: ${p.value ?? '-'} ${unit}`);
                        return `${isFetalMode ? '주차' : '개월'}: ${idx}<br/>` + values.join('<br/>');
                    }
                },
                legend: { data: series.map(s => s.name), bottom: 0 },
                xAxis: { type: 'category', data: xAxis, boundaryGap: false },
                yAxis: { type: 'value', name: `측정값 (${unit})` },
                series
            };
        })
        .catch(err => {
            console.error("UseDetailChart 로딩 실패:", err);
            return {};
        });
};
