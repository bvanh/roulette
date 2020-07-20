import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  Table,
  Pagination,
} from "antd";
import "../static/style/modal.scss";
import { typeModal, rewards } from "../utils/indexModal";
import { imgRewards, img } from "../utils/importImg";
import { login } from "../utils/login";
import {
  getInfoCharacter,
  getInfoSpin,
  getHistorySpin,
} from "../utils/getInfo";
import api from "../api/apiUrl";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// import { FacebookLogout } from 'react-facebook-login'
import localStorageService from "../utils/localStorageService";
import moment from "moment";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
const socialId = {
  googleClappiId:
    "1082828967661-iqn44j6piegilfd75p2718o71tdabe4e.apps.googleusercontent.com",
  facebook3qId: "391762371762430",
  facebookFakeId: "630380541117442"
};
const {
  RULE,
  HISTORY,
  LOGIN,
  ALERT_REWARD,
  PICK_SERVER,
  MESSEAGE,
  LOGOUT,
  ERROR,
} = typeModal;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
  align:"center"
};
const FormAlert = (props) => {
  const { visible, isModal, message, status } = props.indexModal;
  const { prize, indexLogin, indexSpin } = props;
  const { gameUserName, serverName } = indexSpin;
  const [typeLogin, setTypeLogin] = useState({
    isTypeLogin: "",
    demo: false
  });
  const [userInfo, setUserInfo] = useState([
    {
      serverId: "",
      serverName: "",
      userId: "",
      screenName: "",
    },
  ]);
  const [indexHistory, setIndexHistory] = useState({
    pageSize: 10,
    currentPage: 1,
    count: null,
    listHistory: [],
  });
  const [messageError, setMessageError] = useState("");
  const { isTypeLogin, demo } = typeLogin;
  const { listHistory, count, pageSize, currentPage } = indexHistory;
  useEffect(() => {
    switch (isModal) {
      case PICK_SERVER:
        getInfoCharacter().then((response) => {
          const { status, data } = response;
          if (status === 200) {
            setUserInfo(response.data);
          } else {
            props.handleOnModal(ERROR, "", status);
          }
        });
        return;
    }
  }, [isModal]);
  const onFinish = async (values) => {
    const { username, password } = values
    if (username) {
      login(api.AUTH_LOGIN, values, values).then((res) => {
        const { data, status } = res;
        switch (status) {
          case 200:
            resetData();
            props.setIndexLogin({ isLogin: true, userName: values.username });
            getInfoCharacter().then(async (response) => {
              const { status, data } = response;
              switch (status) {
                case 200:
                  await setUserInfo(data);
                  props.handleOnModal(PICK_SERVER);
                  break;
                default:
                  props.handleOnModal(ERROR, "", status);
                  break;
              }
            });
            break;
          default:
            setMessageError(data.message);
            break;
        }
      });
    }
  };
  const logOut = () => {
    localStorageService.resetToken();
    props.setIndexLogin({ ...indexLogin, isLogin: false });
    props.handleOffModal();
    resetData();
    setTypeLogin({ isTypeLogin: "", demo: null });
  };
  const resetData = () => {
    props.setSpin({
      ...indexSpin,
      timesSpin: 1,
      currentTimesSpin: 0,
      serverName: null,
      gameUserName: null,
      positionUser: null,
    });
  };
  const onFieldsChange = () => {
    setMessageError("");
  };
  const onChangeServer = (value, index) => {
    const convertValue = JSON.parse(value);
    const { gameUserId, serverId, gameUserName, serverName } = convertValue;
    const positionUser = { id: index };
    getInfoSpin(positionUser).then((dataSpin) => {
      const { data, status } = dataSpin;
      if (status === 200) {
        const { currentTimes } = data;
        props.setSpin({
          ...indexSpin,
          currentTimesSpin: currentTimes,
          serverName: serverName,
          gameUserName: gameUserName,
          positionUser: index,
        });
      } else {
        props.handleOnModal(ERROR, data.message, status);
      }
    });
    getHistorySpin({ ...indexHistory, ...positionUser }).then((res) => {
      const { data, status } = res;
      if (status === 200) {
        const { rows, count } = data;
        setIndexHistory({ ...indexHistory, listHistory: rows, count: count });
      } else {
        props.handleOnModal(ERROR, data.message, status);
      }
    });
  };
  const onFinishFailed = (val) => {
    console.log(val);
  };
  const responseGoogleOk = (val) => {
    // console.log(val)
    const { tokenId, profileObj } = val;
    login(
      api.AUTH_GG_LOGIN,
      { accessToken: tokenId },
      { username: profileObj.email }
    ).then((res) => {
      // console.log(res);
      const { data, status } = res;
      switch (status) {
        case 200:
          resetData();
          props.setIndexLogin({ isLogin: true, userName: profileObj.email });
          getInfoCharacter().then(async (response) => {
            const { status, data } = response;
            switch (status) {
              case 200:
                await setUserInfo(data);
                props.handleOnModal(PICK_SERVER);
                break;
              default:
                props.handleOnModal(ERROR, "", status);
                break;
            }
          });
          break;
        default:
          setMessageError(data.message);
          break;
      }
    });
  };
  const responseGoogleNg = val => {
    // console.log(val)
  }
  const responseGoogleLogout = (val) => {
    // console.log(val)
  }
  const responseFacebook = (val) => {
    // console.log(val)
    if (val?.accessToken) {
      const { accessToken, name } = val
      login(
        api.AUTH_FB_LOGIN,
        { accessToken: accessToken },
        { username: name }
      ).then((res) => {
        const { data, status } = res;
        switch (status) {
          case 200:
            resetData();
            props.setIndexLogin({ isLogin: true, userName: name });
            getInfoCharacter().then(async (response) => {
              const { status, data } = response;
              switch (status) {
                case 200:
                  await setUserInfo(data);
                  props.handleOnModal(PICK_SERVER);
                  break;
                default:
                  props.handleOnModal(ERROR, "", status);
                  break;
              }
            });
            break;
          default:
            props.handleOnModal(ERROR, data.message, status);
            break;
        }
      });
    }
  };
  const onChangePageHistory = (val) => {
    // console.log(val)
    const { positionUser } = indexSpin;
    getHistorySpin({
      ...indexHistory,
      id: positionUser,
      currentPage: val,
    }).then((res) => {
      // console.log(res);
      const { data, status } = res;
      if (status === 200) {
        const { rows, count } = data.rewards;
        setIndexHistory({
          ...indexHistory,
          listHistory: rows,
          count: count,
          currentPage: val,
        });
      } else {
        props.handleOnModal(ERROR, data.message, status);
      }
    });
  };
  const onLogout = (val) => {
    console.log(val)
  }
  const printModal = () => {
    switch (isModal) {
      case ALERT_REWARD:
        return <div className="alert-rewards">{printRewards(prize)}</div>;
      case RULE:
        return (
          <>
            <p>Thể lệ chơi:</p>
            <p>
              - Người chơi đăng nhập vào landing page và chọn nhận vật để có thể
              tham gia được trò chơi
            </p>
            <p>
              - Mỗi ô trên vòng quay tương ứng với 1 phần quà và người chơi phải
              ấn nút "Quay" để có thể đi đến ô để nhận thưởng
            </p>
            <p>- Mỗi lượt ấn "Quay" sẽ vào ô bất kỳ</p>
            <p>- 1 lượt quay = 20.000đ</p>
            <br />
            <p>Lưu ý:</p>
            <p style={{ color: "#ff5959" }}>
              - Quà sẽ được trả sau 1-2 ngày kể từ ngày quay thưởng, bắt đầu
              tính từ khi bắt đầu nhận được thông báo trên landing page
            </p>
            <p style={{ color: "#ff5959" }}>
              - Nếu nhận được quà là Áo và Móc khóa 3Q Phản Công, Chỉ huy vui
              lòng liên hệ fanpage 3Q Phản Công để cung cấp thông tin
            </p>
          </>
        );
      case LOGIN:
        return <>{printTypeLogin()}</>;
      case PICK_SERVER:
        return <>{printServer}</>;
      case MESSEAGE:
        return (
          <div className="alert-error">
            <h2>{message}</h2>
          </div>
        );
      case ERROR:
        return (
          <div className="alert-error">
            <h1>{status}</h1>
            <h2>{message}</h2>
          </div>
        );
      case LOGOUT:
        return (
          <Row type="flex" justify="space-around" className="alert-logout">
            <img
              src={img["btn_cancel.png"]}
              onClick={() => props.handleOffModal()}
              className="btn-pointer"
            />
            <img
              src={img["btn_enter.png"]}
              onClick={logOut}
              className="btn-pointer"
            />
          </Row>
        );
      default:
        return (
          <>
            <Table
              dataSource={listHistory}
              columns={columns}
              pagination={false}
            />
            <Pagination
              total={count}
              current={currentPage}
              onChange={onChangePageHistory}
              size="small"
            />
          </>
        );
        break;
    }
  };
  const columns = [
    {
      title: "Tên nhân vật",
      dataIndex: "",
      key: "name",
      render: (text) => (
        <span>
          {serverName}-{gameUserName}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "time",
      render: (index) => (
        <span>{moment(index).format("HH:ss DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Vật phẩm",
      dataIndex: "reward",
      key: "reward",
      render: (index) => <span>{rewards[index]}</span>,
    },
  ];
  const printRewards = (arrRewards) => {
    return arrRewards.map((val, index) => (
      <Row key={index} type="flex" align="middle" justify="space-between">
        <img src={imgRewards[`${val}.png`]} width="45px" />
        <h2>{rewards[val]}</h2>
      </Row>
    ));
  };
  const printTypeLogin = () => {
    switch (isTypeLogin) {
      case "":
        return (
          <Row type="flex" justify="space-around" align="center">
            <img
              src={img["btn_login_clappi.png"]}
              className="btn-pointer btn_login"
              onClick={() =>
                setTypeLogin({ ...typeLogin, isTypeLogin: "CLAPPI" })
              }
            />
            {/* <FacebookLogout callback={onLogout} /> */}
            <GoogleLogin
              clientId={socialId.googleClappiId}
              onSuccess={responseGoogleOk}
              onFailure={responseGoogleNg}
              isSignedIn={false}
              render={(renderProps) => (
                <img
                  src={img["btn_login_gg.png"]}
                  className="btn-pointer btn_login"
                  onClick={renderProps.onClick}
                />
              )}
            >
            </GoogleLogin>
            <FacebookLogin
              appId={socialId.facebook3qId}
              callback={responseFacebook}
              autoLoad={false}
              render={(renderProps) => (
                <img
                  src={img["btn_login_fb.png"]}
                  className="btn-pointer btn_login"
                  onClick={renderProps.onClick}
                />
              )}
            />
          </Row>
        );
      case "CLAPPI":
        return (
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onFieldsChange={onFieldsChange}
            layout=''
          >
            <Form.Item label="Tên đăng nhập" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password">
              <Input.Password />
            </Form.Item>
            <Row type="flex" justify="space-around">
              <Col span={4}></Col>
              <Col span={16}>
                <p className="alert-login">{messageError}</p>
              </Col>
            </Row>
            <Form.Item label="submit" className="submit">
              <Button type="link" htmlType="submit" style={{ padding: "0" }}>
                <img
                  src={img["btn_login_enter.png"]}
                  className="btn-pointer"
                  style={{ width: "130px", left: "15px" }}
                />
              </Button>
              {/* <a onClick={() => setTypeLogin({ isTypeLogin: "" })}>Quay lại</a> */}
            </Form.Item>
          </Form>
        );
    }
  };
  const printServer = userInfo.map((val, index) => (
    <Radio.Group
      onChange={(e) => onChangeServer(e.target.value, index)}
      key={index}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Radio
        value={`{"gameUserId":"${val.userId}","serverId":"${val.serverId}","gameUserName":"${val.screenName}","serverName":"${val.serverName}"}`}
      >{`${val.serverName}-${val.screenName}`}</Radio>
    </Radio.Group>
  ));
  return (
    <div>
      <Modal
        className="Modal"
        title={<img src={img[`${isModal}.png`]} className={isModal} />}
        closeIcon={<img src={img["close_modal.png"]} />}
        visible={visible}
        onOk={() => props.handleOffModal()}
        onCancel={() => {
          setTypeLogin({ isTypeLogin: "" })
          props.handleOffModal()
        }}
        footer={null}
        style={isModal === ALERT_REWARD ? { top: 80 } : { top: 150 }}
      >
        {printModal()}
      </Modal>
    </div>
  );
};

export default FormAlert;
