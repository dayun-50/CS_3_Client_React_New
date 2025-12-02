import styles from "./BabySideNavi.module.css";
import { X, LogOut } from "lucide-react";
import BabyController from "./babyController/BabyController";
import BabyButton from "../../member/babyIndex/babyButton/BabyButton";
import useAuthStore from "store/useStore";
import { useNavigate } from "react-router-dom";
import { caxios } from "config/config";


const BabySideNavi = ({ onClose }) => {
  const logout = useAuthStore(state => state.logout);
  const navi = useNavigate();
  const bornDueDate = sessionStorage.getItem("babyDueDate");
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });

  // 태어났는지 여부 계산
  const isBorn = bornDueDate <= today;

  const onclickSecession = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`정말 회원탈퇴를 하시겠습니까?\n이 작업 완료 후 데이터는 되돌릴 수 없습니다.`)) {
      caxios.post("/user/secession")
      .then(resp=>{
        alert("탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.");
        logout();
        navi("/");
      })
    }
  }


  return (
    <>
      {/* 배경 오버레이 */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* 사이드바 패널 */}
      <div className={styles.sidContanier}>
        {/* 닫기 버튼 */}
        <div className={styles.del}>
          <X className={styles.helpIcon} onClick={onClose} />
        </div>
        {/* 카테고리 (세로 모드) */}
        <div className={styles.sidnavi}>
          {/* isVertical={true} - 세로 형태의 디자인 적용 */}
          <BabyButton isVertical={true} isBorn={isBorn} />
        </div>
        {/* 아기 리스트 (사이드바 모드 + 스크롤) */}
        <div className={styles.sidController}>
          {/* isSidebar={true} - 가로 바 형태의 디자인 적용 */}
          <BabyController isSidebar={true} />
        </div>
        {/* 로그아웃 버튼 */}
        <div className={styles.logoutContainer}>
          <button className={styles.logoutButton} onClick={onclickSecession}>
            <LogOut /> 회원탈퇴
          </button>
          <button className={styles.logoutButton} onClick={() => { logout(); navi("/"); }}>
            <LogOut /> 로그아웃
          </button>
        </div>
      </div>
    </>
  );
};

export default BabySideNavi;
