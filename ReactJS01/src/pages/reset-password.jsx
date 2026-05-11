import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { resetPasswordApi } from '../util/api.js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { emailFromUrl, tokenFromUrl } = useMemo(() => {
    return {
      emailFromUrl: searchParams.get('email') || '',
      tokenFromUrl: searchParams.get('token') || '',
    };
  }, [searchParams]);

  const missingQuery = !emailFromUrl || !tokenFromUrl;

  const onFinish = async (values) => {
    const email = values.email;
    const token = values.token;
    const { newPassword } = values;
    const res = await resetPasswordApi(email, token, newPassword);
    if (res?.message && res.message !== 'Đặt lại mật khẩu thành công') {
      notification.error({
        message: 'Đặt lại mật khẩu',
        description: res.message,
      });
      return;
    }
    notification.success({
      message: 'Đặt lại mật khẩu',
      description: res?.message || 'Thành công',
    });
    navigate('/login');
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
          <legend>Đặt lại mật khẩu</legend>
          {missingQuery ? (
            <p style={{ color: '#c00', marginBottom: 16 }}>
              Thiếu email hoặc token trong URL. Hãy dùng liên kết từ bước quên
              mật khẩu hoặc <Link to="/forgot-password">yêu cầu lại</Link>.
            </p>
          ) : null}
          <Form
            name="reset"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              email: emailFromUrl,
              token: tokenFromUrl,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input disabled={!!emailFromUrl} />
            </Form.Item>
            <Form.Item name="token" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Tối thiểu 6 ký tự' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirm"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Hai mật khẩu không khớp')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={missingQuery}
              >
                Cập nhật mật khẩu
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

export default ResetPasswordPage;
