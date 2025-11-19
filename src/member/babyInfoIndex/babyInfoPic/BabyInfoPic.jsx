import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from "./BabyInfoPic.module.css";
import backImg from "./img/back.png";
import jionebabyImg from "./img/jionebaby.png";

//아기 마이페이지 왼쪽 사진쪽
const BabyInfoPic = ()=>{


return(
    <div className={styles.leftcontainer}>
        <div className={styles.one}>
            <img src={backImg} alt="back" className={styles.backImage} />
        </div>

        <div className={styles.two}>
            <img src={jionebabyImg} alt="jionebaby" className={styles.jionewbabyImage} />
        </div>
    </div>

);


}
export default BabyInfoPic;