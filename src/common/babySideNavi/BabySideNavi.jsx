import styles from "./BabySideNavi.module.css";
import { X, LogOut, UserX } from "lucide-react";
import BabyController from "./babyController/BabyController";
import BabyButton from "../../member/babyIndex/babyButton/BabyButton";
import useAuthStore from "store/useStore";
import { useNavigate } from "react-router-dom";
import { caxios } from "config/config";

const BabySideNavi = ({ onClose, setIsNavOpen, setIsCounselOpen }) => {
  const logout = useAuthStore((state) => state.logout);
  const navi = useNavigate();
  const bornDueDate = sessionStorage.getItem("babyDueDate");
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });

  const isBorn = bornDueDate <= today;

  const handleEmergencyClick = () => {
    setIsCounselOpen(true);
    onClose();
  };

  const onclickSecession = () => {
    // eslint-disable-next-line no-restricted-globals
    if (
      window.confirm(
        `정말 회원탈퇴를 하시겠습니까?\n이 작업 완료 후 데이터는 되돌릴 수 없습니다.`
      )
    ) {
      caxios.delete("/user/secession").then((resp) => {
        alert("탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.");
        navi("/");
        setIsNavOpen(false);
        logout();
      });
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.sidContanier}>
        <div className={styles.del}>
          <X className={styles.helpIcon} onClick={onClose} />
        </div>

        <div className={styles.sidnavi}>
          <BabyButton
            isVertical={true}
            isBorn={isBorn}
            onEmergencyClick={handleEmergencyClick}
          />
        </div>

        <div className={styles.sidController}>
          <BabyController isSidebar={true} />
        </div>

        <div className={styles.exitContainer}>
          <button className={styles.exit} onClick={onclickSecession}>
            <UserX /> 회원탈퇴
          </button>
        </div>
      </div>
    </>
  );
};

export default BabySideNavi;
