import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { forgotPasswordApi } from '../util/api.js';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ForgotPasswordPage = () => {
  const onFinish = async (values) => {
    const { email } = values;
    const res = await forgotPasswordApi(email);
    if (res?.message) {
      notification.info({
        message: 'Quên mật khẩu',
        description: res.message,
      });
    } else {
      notification.error({
        message: 'Quên mật khẩu',
        description: 'Không thể xử lý yêu cầu',
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: '15px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <legend>Quên mật khẩu</legend>
          <p style={{ marginBottom: 16, color: '#666' }}>
            Nhập email đã đăng ký. Trong môi trường phát triển, kiểm tra terminal
            của server để lấy liên kết đặt lại mật khẩu.
          </p>
          <Form
            name="forgot"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
          <Link to="/login">
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
          <Divider />
        </fieldset>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
