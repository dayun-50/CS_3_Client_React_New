export const UseTotalChart = (currentWeek, standardData, actualData, inputs) => {
    if (!standardData) {
        return {};
    }
    const keyMap = {
      EFW: "몸무게",
      OFD: "머리직경",
      HC: "머리둘레",
      AC: "복부둘레",
      FL: "허벅지 길이"
    };
    const safeInputs = inputs && typeof inputs === "object" ? inputs : {};

    // 데이터 변환 및 옵션 설정 로직
    const indicators = Object.keys(standardData).map(key => ({
        
        name: standardData[key].name, 
        max: standardData[key].max * 1.05, 
        unit: standardData[key].unit
    }));
    
    const averageValues = Object.keys(standardData).map(key => standardData[key].avg);

    const actualValues = Object.keys(standardData).map(key => {
        // actualData가 없으면 inputs로 fallback
        if (actualData && actualData[key] !== undefined) {
            return key === "EFW" ? (actualData[key] ?? 0) : actualData[key] ?? 0;
        } else {
            return key === "EFW" ? Number(safeInputs["몸무게"] ?? 0) * 1000 : Number(safeInputs[keyMap[key]] ?? 0);
        }
    });



    return {
        title: { text: `임신 ${currentWeek}주 태아 성장 분석`, left: 'center' },
        legend: { data: ['내 아기 측정치', '표준 평균'], bottom: 0 },
        tooltip: {},
        radar: {
            indicator: indicators,
            name: { 
                formatter: (value, indicator) => `${value} (${indicator.unit})`, 
                textStyle: { color: '#000', backgroundColor: '#f1f1f1', borderRadius: 3, padding: [3, 5] }
            },
            radius: '65%',
        },
        series: [{
            name: `측정 vs 표준 (${currentWeek}주)`,
            type: 'radar',
            data: [
                { value: actualValues, name: '내 아기 측정치', symbolSize: 8 },
          { value: averageValues, name: '표준 평균', symbolSize: 0 }
            ]
        }]
    };
};