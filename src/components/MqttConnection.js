import React from "react";
import { Card, Button, Form, Input, Row, Col } from "antd";

const MqttConnection = ({ connect, disconnect, connectBtn }) => {
  const [form] = Form.useForm();
  const initialConnectionOptions = {
    host: "broker.emqx.io",
    clientId: "test" + Math.random().toString(16).substring(2, 8),
    port: 8083,
  };

  const onFinish = ({ host, clientId, port }) => {
    const url = `ws://${host}:${port}/mqtt`;
    const options = {
      clientId,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };
    connect(url, options);
  };

  const handleConnect = () => {
    form.submit();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Card
      title="Connection"
      actions={[
        <Button type="primary" onClick={handleConnect}>
          {connectBtn}
        </Button>,
        <Button danger onClick={handleDisconnect}>
          Disconnect
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        name="basic"
        form={form}
        initialValues={initialConnectionOptions}
        onFinish={onFinish}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item label="Host" name="host">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Port" name="port">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Client ID" name="clientId">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default MqttConnection;
