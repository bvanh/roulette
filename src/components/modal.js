import React from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import "../static/style/modal.scss";
import typeModal from "../utils/tyleModal";
import { img } from "../utils/importImg";
const { RULE, HISTORY, LOGIN } = typeModal;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const FormAlert = (props) => {
    const { visible, isModal } = props.indexModal;
    const onFinish = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const printModal = () => {
        switch (isModal) {
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
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Tên đăng nhập"
                                name="username"
                                rules={[
                                    { required: true, message: "Kiểm tra lại tên đăng nhập !" },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: "Kiểm tra lại mật khẩu!" },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item style={{ display: "none" }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                </Button>
                            </Form.Item>
                        </Form>
                    </>
                );
            default:
                break;
        }
    };
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
            >
                {printModal()}
            </Modal>
        </div>
    );
};

export default FormAlert;
