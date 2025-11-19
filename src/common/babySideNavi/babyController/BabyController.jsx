import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from "./BabyController.module.css";
import yellowImg from "./img/yellow.png";

//아기 선택부붙
const BabyController = ()=>{
return(
    <div className={styles.rightcontainer}>
        <div className={styles.margin}>
            
        </div>

        <div className={styles.full}>
            <div className={styles.one}>
                아기가 추가될 곳이에용
            </div>

            <div className={styles.two}>
                <button className={styles.plusbutton}> <img src={yellowImg} alt="yellow" className={styles.yellowImage} /> 아기추가</button>
            </div>
        </div>
    </div>
);


}
export default BabyController;
