import React, { useState, useContext, useEffect } from "react";
import Roulette from "react-roulette-game";
import { Row, Col } from "antd";
import { img } from "./utils/importImg";
import FormAlert from "./components/modal";
import typeModal from './utils/tyleModal'
import "./App.scss";
let roulette_img_on_highlight = img["wheel.png"];
let roulette_img_under_highlight = img["wheel.png"];
const { RULE, HISTORY, LOGIN, ALERT_REWARD } = typeModal;
const rewards_arr = [
  "Mảnh Valkyrie*5",
  "Mảnh Caroline*3",
  "Vàng*10.000",
  "Quyền triệu hồi vũ khí cao cấp*1",
  "Ruby*100",
  "Triệu hồi 10+1 lần lực lượng",
  "Áo 3Q Phản Công",
  "Triệu hồi 10+1 lần trang bị",
  "Móc khóa 3Q Phản Công",
];
function App() {
  const [mustSpin, setMustSpin] = useState({
    isSpin: false,
    disableButton: "",
  });
  const [indexModal, setIndexModal] = useState({
    isModal: LOGIN,
    visible: false
  });
  const [prize, setPrize] = useState(3);
  const [isLogin, setIsLogin] = useState(false);
  const [reset, setReset] = useState(false);
  const [rewards, setRewards] = useState([])
  const { isSpin, disableButton } = mustSpin;
  let set_prize = prize;
  let start = isSpin;
  useEffect(() => {
    setRewards(rewards_arr)
  }, [])
  const roulette_props = {
    roulette_img_under_highlight,
    roulette_img_on_highlight,
    start,
    has_reset: false,
    set_prize,
    reset,
    on_complete: (prize) => alertPrize(prize),
    prize_arr: rewards
  };
  const handleOnModal = (isModal) => {
    setIndexModal({ ...indexModal, visible: true, isModal: isModal });
  };
  const handleOffModal = () => {
    setIndexModal({ ...indexModal, visible: false });
  };
  const alertPrize = async (prize) => {
    await setMustSpin({ ...mustSpin, isSpin: false });
    setTimeout(setReset(true), 2000);
    handleOnModal(ALERT_REWARD);
  };
  const startSpin = async () => {
    await setMustSpin({ ...mustSpin, isSpin: true });
    setReset(false);
    setMustSpin({ ...mustSpin, disableButton: "disable-spin" });
  };
  const printIsLogin = () => {
    switch (isLogin) {
      case true:
        return (
          <div>
            <img src={img["btn_account.png"]} />
            <span id="userName">vongquaynhanpham</span>
          </div>
        )
      default:
        return (
          <div>
            <img src={img["btn_login.png"]} style={{ width: "195px" }} className='btn-pointer' onClick={() => handleOnModal(LOGIN)} />
          </div>
        )
    }
  }
  return (
    <div className="App">
      <FormAlert
        indexModal={indexModal}
        handleOffModal={handleOffModal}
        prize={prize}
        rewards={rewards}
      />
      <Row justify="center" className="btn-header">
        <Col xl={{ span: 7 }} lg={{ span: 9 }} md={{ span: 11 }} xs={{span:11.5}}>
          {printIsLogin()}
          <div className='number-row-mobile'>
            <img src={img["btn_number_row.png"]} />
            <span>0 lượt</span>
          </div>
        </Col>
        <Col xl={{ span: 7 }} lg={{ span: 9 }} md={{ span: 11 }} xs={{span:11.5}}>
          <div className='number-row-desktop'>
            <img src={img["btn_number_row.png"]} />
            <span>0 lượt</span>
          </div>
          <img src={img["btn_history_event.png"]} onClick={() => handleOnModal(HISTORY)} className='btn-pointer' id='history-roulette' />
          <img src={img["btn_rule_event.png"]} onClick={() => handleOnModal(RULE)} className='btn-pointer' />
        </Col>
      </Row>
      <div className="game-box">
        <Roulette {...roulette_props} />
        <img src={img["wheel_background.png"]} className="wheel-background" />
        <img src={img["wheel-border.png"]} className="wheel-border" />
        <img
          src={img["wheel-button.png"]}
          className={`wheel-button ${disableButton} btn-pointer`}
          onClick={startSpin}
        />
        <img src={img["model.png"]} className="model" />
      </div>
      <Row justify="center" className="btn-homepage">
        <Col sm={{ span: 3 }} xs={{ span: 10 }} style={{ marginRight: '10rem' }}>
          <img src={img["btn_homepage.png"]} className='btn-pointer' />
        </Col>
        <Col sm={{ span: 3 }} xs={{ span: 10 }} style={{ marginLeft: '10rem' }}>
          <img src={img["btn_fanpage.png"]} className='btn-pointer' />
        </Col>
      </Row>
    </div>
  );
}

export default App;
