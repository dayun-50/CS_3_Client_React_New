import { caxios } from "../../../config/config";


export const submitChartData = async ({ date, babySeq, id, measureTypes, actualData }) => {

  const payload = Object.entries(measureTypes)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([type, value]) => ({
      baby_seq: babySeq,
      user_id: id,
      measure_date: date,
      measure_type: type,
      measure_value: type === "EFW" ? parseFloat(value) * 1000 : parseFloat(value),
      created_at: actualData.measure_date
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

export const updateChartData = async ({ date, babySeq, id, measureTypes, actualData }) => {
  const payload = Object.entries(measureTypes)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([type, value]) => ({
      baby_seq: babySeq,
      user_id: id,
      measure_date: date,
      measure_type: type,
      measure_value: type === "EFW" ? parseFloat(value) * 1000 : parseFloat(value),
      created_at: actualData.measure_date
    }));

  if (payload.length === 0) {
    alert("변경된 항목이 없습니다.");
    return null;
  }

  console.log("UPDATE payload:", payload);

  try {
    const res = await caxios.put(`/chart/update`, payload

    );
    alert("수정 완료!");

    return res.data;
  } catch (e) {
    console.error(e);
    alert("수정 실패");
    return null;
  }
};

