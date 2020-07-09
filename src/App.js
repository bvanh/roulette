import React, { useState, useEffect } from "react";
import Roulette from "react-roulette-game";
import { Row, Col } from "antd";
import { img } from "./utils/importImg";
import FormAlert from "./components/modal";
import typeModal from "./utils/tyleModal";
import localStorageService from "./utils/localStorageService";
import { getResultSpin } from './utils/getInfo'
import { checkInfoSpin } from './utils/checkInfo'
import "./App.scss";
let roulette_img_on_highlight = img["wheel.png"];
let roulette_img_under_highlight = img["wheel.png"];
const { RULE, HISTORY, LOGIN, ALERT_REWARD, PICK_SERVER } = typeModal;
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
    visible: false,
  });
  const [prize, setPrize] = useState([]);
  const [indexLogin, setIndexLogin] = useState({
    isLogin: localStorageService.getToken() ? true : false,
    userName: localStorageService.getToken()?.username,
    password: "",
  });
  const [indexSpin, setIndexSpin] = useState({
    currentTimesSpin: 0,
    timesSpin: 1,
    serverName: null,
    gameUserName: null,
    serverId: 0,
    gameUserId: 0,
  })
  const [reset, setReset] = useState(false);
  const [rewards, setRewards] = useState([]);
  const { isSpin, disableButton } = mustSpin;
  const { gameUserName, serverName, currentTimesSpin, timesSpin } = indexSpin;
  const { isLogin, userName, password } = indexLogin;
  let set_prize = prize[0];
  let start = isSpin;
  useEffect(() => {
    setRewards(rewards_arr);
  }, []);
  const roulette_props = {
    roulette_img_under_highlight,
    roulette_img_on_highlight,
    start,
    has_reset: false,
    set_prize,
    reset,
    on_complete: (prize) => alertPrize(prize),
    prize_arr: rewards,
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
    setIndexSpin({ ...indexSpin, timesSpin: 1 })
  };
  const startSpin = async () => {
    const { timesSpin, gameUserId, serverId } = indexSpin
    const isValidSpin = checkInfoSpin(gameUserId, serverId);
    switch (isValidSpin) {
      case false:
        handleOnModal('THÔNG BÁO')
        break;
      default:
        const params = {
          gameUserId: gameUserId,
          spinTimes: timesSpin,
          serverId: serverId
        }
        await getResultSpin(params).then(result => {
          setPrize(result.results)
        })
        setMustSpin({ ...mustSpin, isSpin: true });
        setReset(false);
        setMustSpin({ ...mustSpin, disableButton: "disable-spin" });
        break;
    }
  };
  const setTimesSpin = (value) => {
    setIndexSpin({ ...indexSpin, timesSpin: value })
  }
  const printIsLogin = () => {
    switch (isLogin) {
      case true:
        return (
          <div>
            <div>
              <img
                src={img["btn_account.png"]}
                style={{ position: "relative", top: "-5px" }}
                onClick={() => handleOnModal(LOGIN)}
                className="btn-pointer"
                alt="btn_account"
              />
              <span id="userName">{userName}</span>
            </div>
            <div>
              <img
                src={img["btn_gameUser.png"]}
                style={{ position: "relative", top: "-5px" }}
                onClick={() => handleOnModal(PICK_SERVER)}
                className="btn-pointer"
                alt="btn_account"
              />
              <span id="userName">{gameUserName}</span>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <img
              src={img["btn_login.png"]}
              style={{ width: "195px" }}
              className="btn-pointer"
              onClick={() => handleOnModal(LOGIN)}
              alt="btn_login"
            />
          </div>
        );
    }
  };
  return (
    <div className="App">
      <FormAlert
        indexModal={indexModal}
        indexLogin={indexLogin}
        prize={prize}
        rewards={rewards}
        indexSpin={indexSpin}
        handleOffModal={handleOffModal}
        handleOnModal={handleOnModal}
        setIndexLogin={setIndexLogin}
        setSpin={setIndexSpin}
      />
      <Row justify="center" className="btn-header">
        <Col
          xl={{ span: 7 }}
          lg={{ span: 9 }}
          md={{ span: 11 }}
          xs={{ span: 11.5 }}
          className={isLogin ? "isLogin" : ""}
        >
          {printIsLogin()}
          <div className="number-row-mobile">
            <img src={img["btn_number_row.png"]} />
            <span>{currentTimesSpin} lượt</span>
          </div>
        </Col>
        <Col
          xl={{ span: 7 }}
          lg={{ span: 9 }}
          md={{ span: 11 }}
          xs={{ span: 11.5 }}
        >
          <div className="number-row-desktop">
            <img src={img["btn_number_row.png"]} />
            <span>{currentTimesSpin} lượt</span>
          </div>
          <img
            src={img["btn_history_event.png"]}
            onClick={() => handleOnModal(HISTORY)}
            className="btn-pointer"
            id="history-roulette"
          />
          <img
            src={img["btn_rule_event.png"]}
            onClick={() => handleOnModal(RULE)}
            className="btn-pointer"
          />
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
      <Row justify="center" className="btn-setNumRow" type="flex">
        <Col sm={{ span: 1.5 }}>
          <img
            src={img["btn_quay1lan.png"]}
            className={`btn-pointer ${disableButton} ${timesSpin === 1 ? "isPickedTimesSpin" : ""}`}
            onClick={() => setTimesSpin(1)}
          />
        </Col>
        <Col sm={{ span: 1.5 }}>
          <img
            src={img["btn_quay10lan.png"]}
            className={`btn-pointer ${disableButton} ${timesSpin === 10 ? "isPickedTimesSpin" : ""}`}
            onClick={() => setTimesSpin(10)}
          />
        </Col>
      </Row>
      <Row justify="center" className="btn-homepage">
        <Col
          sm={{ span: 3 }}
          xs={{ span: 10 }}
          style={{ marginRight: "10rem" }}
        >
          <img src={img["btn_homepage.png"]} className="btn-pointer" />
        </Col>
        <Col sm={{ span: 3 }} xs={{ span: 10 }} style={{ marginLeft: "10rem" }}>
          <img src={img["btn_fanpage.png"]} className="btn-pointer" />
        </Col>
      </Row>
    </div>
  );
}

export default App;
