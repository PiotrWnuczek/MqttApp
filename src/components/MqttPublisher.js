import React from "react";
import { Card, Form, Input, Row, Col, Button } from "antd";

const MqttPublisher = ({ publish }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    publish(values);
  };

  return (
    <Card title="Publisher">
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
          <Col span={24}>
            <Form.Item label="Payload" name="payload">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Publish
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default MqttPublisher;
