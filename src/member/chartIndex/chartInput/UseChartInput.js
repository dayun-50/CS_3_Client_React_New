import { caxios } from "../../../config/config";

// 전송 로직 분리
export const submitChartData = async ({ inputs, date, babySeq, id, measureTypes }) => {

  const payload = Object.entries(measureTypes)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([type, value]) => ({
      baby_seq: babySeq,
      user_id: id,
      measure_date: date,
      measure_type: type,
      measure_value: type === "EFW" ? parseFloat(value) * 1000 : parseFloat(value),
    }));

  console.log("payload", JSON.stringify(payload));
  try {
    const res = await caxios.post("/chart/insert", payload);
    alert("저장 완료!");

    return res.data; // 
  } catch (err) {
    console.error(err);
    alert("저장 실패");
    return null;
  }
};

export const updateChartData = async ({ inputs, date, babySeq, id, actualData }) => {
  const payload = Object.entries(inputs)
    .filter(([key, value]) => value !== actualData[key])
    .map(([key, value]) => ({
      baby_seq: babySeq,
      user_id: id,
      measure_date: date,
      measure_type: key,
      measure_value: key === "EFW" ? parseFloat(value) * 1000 : parseFloat(value),
    }));

  if (payload.length === 0) {
    alert("변경된 항목이 없습니다.");
    return null;
  }

  console.log("UPDATE payload:", payload);

  try {
    const res = await caxios.patch(`/chart/update/${babySeq}`, payload);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

