import React from "react";
import { Card, Form, Input, Row, Col, Button } from "antd";

const MqttSubscriber = ({ sub, unSub, showUnsub }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    sub(values);
  };

  const handleUnsub = () => {
    const values = form.getFieldsValue();
    unSub(values);
  };

  return (
    <Card title="Subscriber">
      <Form
        layout="vertical"
        name="basic"
        form={form}
        onFinish={onFinish}
        initialValues={{
          topic: "testtopic/react",
        }}
      >
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item label="Topic" name="topic">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Subscribe
              </Button>
              {showUnsub ? (
                <Button style={{ marginLeft: 10 }} onClick={handleUnsub}>
                  Unsubscribe
                </Button>
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default MqttSubscriber;
