import React, { useState, useEffect } from "react";
import Roulette from "react-roulette-game";
import { Row, Col, message } from "antd";
import { img } from "./utils/importImg";
import FormAlert from "./components/modal";
import { typeModal, rewards } from "./utils/indexModal";
import cookieService from "./utils/cookieService";
import { getResultSpin, getHistorySpin } from "./utils/getInfo";
import { checkInfoSpin, listError } from "./utils/checkInfo";
import { SwapOutlined, LogoutOutlined } from "@ant-design/icons";
import "./App.scss";
import { checkAccessToken } from "./utils/checkToken";
let roulette_img_on_highlight = img["wheel.png"];
let roulette_img_under_highlight = img["wheel.png"];
const {
  RULE,
  HISTORY,
  LOGIN,
  ALERT_REWARD,
  PICK_SERVER,
  MESSEAGE,
  LOGOUT,
  ERROR
} = typeModal;
const { GAMEUSER_ERROR, TIMESPIN_ERROR, ACCOUNT_ERROR } = listError;
function App() {
  const [mustSpin, setMustSpin] = useState({
    isSpin: false,
    disableButton: "",
  });
  const [indexModal, setIndexModal] = useState({
    isModal: LOGIN,
    visible: false,
    status: null,
    message: "",
  });
  const [prize, setPrize] = useState([]);
  const [indexLogin, setIndexLogin] = useState({
    isLogin: cookieService.getToken() ? true : false,
    userName: cookieService.getToken()?.username,
    password: "",
  });
  const [indexSpin, setIndexSpin] = useState({
    currentTimesSpin: 0,
    timesSpin: 1,
    serverName: null,
    gameUserName: null,
    positionUser: null
  });
  const [indexHistory, setIndexHistory] = useState({
    pageSize: 10,
    currentPage: 1,
    count: null,
    listHistory: [],
  });
  const [reset, setReset] = useState(false);
  const { isSpin, disableButton } = mustSpin;
  const { gameUserName, serverName, currentTimesSpin, timesSpin, positionUser } = indexSpin;
  const { isLogin, userName, password } = indexLogin;
  let set_prize = prize[0];
  let start = isSpin;
  useEffect(() => {
    if (checkAccessToken()) {
      cookieService.resetToken();
      setIndexLogin({ ...indexLogin, isLogin: false });
    }
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
  const setIndexOnModal = (isModal, messageModal, status) => {
    setIndexModal({
      ...indexModal,
      visible: true,
      isModal: isModal,
      message: messageModal,
      status: status
    });
  }
  const handleOnModal = async (isModal, message, status) => {
    switch (isModal) {
      case HISTORY:
        switch (positionUser) {
          case null:
            handleOnModal(MESSEAGE, GAMEUSER_ERROR);
            break;
          default:
            await getHistorySpin({ ...indexHistory, id: positionUser }).then((res) => {
              // console.log(res)
              const { data, status } = res;
              if (status === 200) {
                const { rows, count } = data;
                setIndexHistory({ ...indexHistory, listHistory: rows, count: count });
              } else {
                handleOnModal(ERROR, data.message, status);
              }
            });
            setIndexOnModal(isModal, message, status)
            break;
        }
        break;
      default:
        setIndexOnModal(isModal, message, status)
        break;
    }
  };
  const handleOffModal = () => {
    setIndexModal({ ...indexModal, visible: false });
  };
  const alertPrize = async (prize) => {
    await setMustSpin({ ...mustSpin, isSpin: false });
    setTimeout(setReset(true), 2000);
    handleOnModal(ALERT_REWARD);
    setIndexSpin({ ...indexSpin, timesSpin: 1 });
  };
  const startSpin = async () => {
    const isValidSpin = checkInfoSpin(
      isLogin,
      positionUser,
      timesSpin,
      currentTimesSpin
    );
    switch (isValidSpin) {
      case ACCOUNT_ERROR:
        handleOnModal(LOGIN);
        break;
      case GAMEUSER_ERROR:
        handleOnModal(MESSEAGE, GAMEUSER_ERROR);
        break;
      case TIMESPIN_ERROR:
        handleOnModal(MESSEAGE, TIMESPIN_ERROR);
        break;
      default:
        const params = {
          id: positionUser,
          spinTimes: timesSpin,
        };
        await getResultSpin(params).then((result) => {
          // console.log(result)
          const { data, status } = result;
          if (status === 200) {
            const { currentTimes, results } = data;
            setPrize(results);
            setIndexSpin({ ...indexSpin, currentTimesSpin: currentTimes });
            setMustSpin({ ...mustSpin, isSpin: true });
            setReset(false);
            setMustSpin({ ...mustSpin, disableButton: "disable-spin" });
          } else {
            handleOnModal(ERROR, data.message, status)
          }
        })
        break;
    }
  };
  const setTimesSpin = (value) => {
    setIndexSpin({ ...indexSpin, timesSpin: value });
  };
  const printIsLogin = () => {
    switch (isLogin) {
      case true:
        return (
          <div>
            <div onClick={() => handleOnModal(LOGOUT)} className="btn-pointer">
              <img
                src={img["btn_account.png"]}
                style={{ position: "relative", top: "-5px" }}
                alt="btn_account"
              />
              <LogoutOutlined />
              <span id="userName" className={userName.length > 14 ? 'long-character' : ''}>{userName}</span>
            </div>
            <div
              onClick={() => handleOnModal(PICK_SERVER)}
              className="btn-pointer"
            >
              <img
                src={img["btn_gameUser.png"]}
                style={{ position: "relative", top: "-5px" }}
                alt="btn_account"
              />
              <SwapOutlined />
              <span id="userName" className={gameUserName?.length > 14 ? 'long-character' : ''}>{gameUserName}</span>
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
  const onChangePageHistory = (val) => {
    const { positionUser } = indexSpin;
    getHistorySpin({
      ...indexHistory,
      id: positionUser,
      currentPage: val,
    }).then((res) => {
      // console.log(res);
      const { data, status } = res;
      if (status === 200) {
        const { rows, count } = data;
        setIndexHistory({
          ...indexHistory,
          listHistory: rows,
          count: count,
          currentPage: val,
        });
      } else {
        handleOnModal(ERROR, data.message, status);
      }
    });
  };
  return (
    <div className="App">
      <FormAlert
        indexModal={indexModal}
        indexLogin={indexLogin}
        indexHistory={indexHistory}
        prize={prize}
        indexSpin={indexSpin}
        handleOffModal={handleOffModal}
        handleOnModal={handleOnModal}
        setIndexLogin={setIndexLogin}
        setSpin={setIndexSpin}
        setIndexHistory={setIndexHistory}
        onChangePageHistory={onChangePageHistory}
      />
      <Row justify="center" className="btn-header">
        <Col
          xl={{ span: 7 }}
          lg={{ span: 9 }}
          md={{ span: 11 }}
          xs={{ span: 11.8 }}
          className={isLogin ? "isLogin" : ""}
        >
          {printIsLogin()}
          {/* <div className="number-row-mobile">
            <img src={img["btn_number_row.png"]} />
            <span>{currentTimesSpin} lượt</span>
          </div> */}
        </Col>
        <Col
          xl={{ span: 7 }}
          lg={{ span: 9 }}
          md={{ span: 11 }}
          xs={{ span: 11 }}
          className='isSpin'
        >
          <div>
            <img src={img["btn_number_row.png"]} />
            <span>{currentTimesSpin} lượt</span>
          </div>
          <img
            src={img["btn_history_event.png"]}
            onClick={() => handleOnModal(HISTORY)}
            className={`btn-pointer ${disableButton}`}
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
            className={`btn-pointer ${disableButton} ${
              timesSpin === 1 ? "" : "isPickedTimesSpin"
              }`}
            onClick={() => setTimesSpin(1)}
          />
        </Col>
        <Col sm={{ span: 1.5 }}>
          <img
            src={img["btn_quay10lan.png"]}
            className={`btn-pointer ${disableButton} ${
              timesSpin === 10 ? "" : "isPickedTimesSpin"
              }`}
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
          <a href="https://3qphancong.lussom.vn/" target="_blank">
            <img src={img["btn_homepage.png"]} className="btn-pointer" />
          </a>
        </Col>
        <Col sm={{ span: 3 }} xs={{ span: 10 }} style={{ marginLeft: "10rem" }}>
          <a href="https://www.facebook.com/3QZVN/" target="_blank">
            <img src={img["btn_fanpage.png"]} className="btn-pointer" />
          </a>
        </Col>
      </Row>
    </div>
  );
}

export default App;
