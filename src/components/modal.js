import React, { useState, useMemo, useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Row, Col } from "antd";
import "../static/style/modal.scss";
import typeModal from "../utils/tyleModal";
import { imgRewards, img } from "../utils/importImg";
import { login } from "../utils/login";
import { getInfoCharacter, getInfoSpin } from "../utils/getInfo";
import { checkAccessToken } from "../utils/checkToken";
const { RULE, HISTORY, LOGIN, ALERT_REWARD, PICK_SERVER } = typeModal;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const FormAlert = (props) => {
    const { visible, isModal } = props.indexModal;
    const { prize, rewards, indexLogin, indexSpin } = props;
    const [userInfo, setUserInfo] = useState([
        {
            serverId: "",
            serverName: "",
            userId: "",
            screenName: "",
        },
    ]);
    const [messageError, setMessageError] = useState("");
    useEffect(() => {
        if (checkAccessToken()) {
            getInfoCharacter().then((response) => {
                setUserInfo(response);
            });
        }
    }, []);
    const onFinish = async (values) => {
        login(values).then((value) => {
            if (value.status === 200) {
                getInfoCharacter().then((response) => {
                    console.log(response);
                    setUserInfo(response);
                });
                props.setIndexLogin({ isLogin: true, userName: values.username });
                props.handleOnModal(PICK_SERVER);
            } else {
                setMessageError(value.data.message);
            }
        });
    };
    const onFieldsChange = () => {
        setMessageError("");
    };
    const onChangeServer = (value) => {
        const convertValue = JSON.parse(value);
        const { gameUserId, serverId, serverName } = convertValue;
        const params = {
            gameUserId: gameUserId,
            serverId: serverId,
        };
        getInfoSpin(params).then((dataSpin) => {
            const { screenName, currentTimes } = dataSpin;
            props.setSpin({
                ...indexSpin,
                currentTimesSpin: currentTimes,
                serverName: serverName,
                gameUserName: screenName,
                gameUserId: gameUserId,
                serverId: serverId
            });
        });
    };
    const printModal = () => {
        switch (isModal) {
            case ALERT_REWARD:
                return (
                    <div className="alert-rewards">
                       {printRewards(prize)}
                    </div>
                );
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
                return (
                    <>
                        <Form
                            {...layout}
                            name="basic"
                            onFinish={onFinish}
                            onFieldsChange={onFieldsChange}
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
                            <Form.Item style={{ display: "none" }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                </Button>
                            </Form.Item>
                        </Form>
                    </>
                );
            case PICK_SERVER:
                return <>{printServer}</>;
            default:
                break;
        }
    };
    const printRewards = (arrRewards) => {
       return arrRewards.map((val, index) => (
            <Row key={index} type='flex' align="middle" justify="space-between">
                <img src={imgRewards[`${val}.png`]} width="45px" />
                <h2>{rewards[val]}</h2>
            </Row>
        ))
    }
    const printServer = userInfo.map((val, index) => (
        <Radio.Group onChange={(e) => onChangeServer(e.target.value)} key={index}>
            <Radio
                value={`{"gameUserId":"${val.userId}","serverId":"${val.serverId}","serverName":"${val.serverName}"}`}
            >{`${val.serverName}-${val.screenName}`}</Radio>
        </Radio.Group>
    ));
    return (
        <div>
            <Modal
                className="Modal"
                title={<img src={img[`${isModal}.png`]} />}
                closeIcon={<img src={img["close_modal.png"]} />}
                visible={visible}
                onOk={() => props.handleOffModal()}
                onCancel={() => props.handleOffModal()}
                footer={null}
                style={{ top: 200 }}
            >
                {printModal()}
            </Modal>
        </div>
    );
};

export default FormAlert;