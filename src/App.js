import React, { useState, useEffect } from "react";
import Roulette from "react-roulette-game";
import { Row, Col } from "antd";
import { img } from "./utils/importImg";
import FormAlert from "./components/modal";
import typeModal from './utils/tyleModal'
import "./App.scss";
let roulette_img_on_highlight = img["wheel.png"];
let roulette_img_under_highlight = img["wheel.png"];
const { RULE, HISTORY, LOGIN } = typeModal;
function App() {
  const [mustSpin, setMustSpin] = useState({
    isSpin: false,
    disableButton: "",
  });
  const [indexModal, setIndexModal] = useState({
    isModal: LOGIN,
    visible: false,
  });
  const [prize, setPrize] = useState(2);
  const [isLogin, setIsLogin] = useState(false);
  const [reset, setReset] = useState(false);
  const { isSpin, disableButton } = mustSpin;
  let set_prize = prize;
  let start = isSpin;
  const roulette_props = {
    roulette_img_under_highlight,
    roulette_img_on_highlight,
    start,
    has_reset: false,
    set_prize,
    reset,
    on_complete: (prize) => alertPrize(prize),
    prize_arr: [
      "Mảnh Valkyrie*5",
      "Mảnh Caroline*3",
      "Vàng*10.000",
      "Quyền triệu hồi vũ khí cao cấp*1",
      "Ruby*100",
      "Triệu hồi 10+1 lần lực lượng",
      "Áo 3Q Phản Công",
      "Triệu hồi 10+1 lần trang bị",
      "Móc khóa 3Q Phản Công",
    ],
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
      />
      <Row justify="center" className="btn-header">
        <Col span={6}>
          {printIsLogin()}
        </Col>
        <Col span={6}>
          <div>
            <img src={img["btn_number_row.png"]} />
            <span>1000 lượt</span>
          </div>
          <img src={img["btn_history_event.png"]} onClick={() => handleOnModal(HISTORY)} className='btn-pointer' />
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
        <Col span={3} style={{marginRight:'10rem'}}>
          <img src={img["btn_homepage.png"]} className='btn-pointer'/>
        </Col>
        <Col span={3} style={{marginLeft:'10rem'}}>
          <img src={img["btn_fanpage.png"]} className='btn-pointer'/>
        </Col>
      </Row>
    </div>
  );
}

export default App;
