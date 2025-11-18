import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from "./BabyInfoPic.module.css";
import whitebabyImg from "./img/whitebaby.png";

//아기 마이페이지 왼쪽 사진쪽
const BabyInfoPic = ()=>{


return(
    <div className={styles.leftcontainer}>
        <img src={whitebabyImg} alt="baby" className={styles.babyImage} />
    </div>
);


}
export default BabyInfoPic;