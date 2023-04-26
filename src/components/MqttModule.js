import React, { useEffect, useState } from "react";
import { Space } from "antd";
import MqttConnection from "./MqttConnection";
import MqttPublisher from "./MqttPublisher";
import MqttSubscriber from "./MqttSubscriber";
import MqttReceiver from "./MqttReceiver";
import mqtt from "mqtt/dist/mqtt";

const MqttModule = () => {
  const [client, setClient] = useState(null);
  const [isSubed, setIsSub] = useState(false);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
        console.log("connection successful");
      });

      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });

      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });

      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
        console.log(`received message: ${message} from topic: ${topic}`);
      });
    }
  }, [client]);

  const mqttDisconnect = () => {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus("Connect");
          console.log("disconnected successfully");
        });
      } catch (error) {
        console.log("disconnect error:", error);
      }
    }
  };

  const mqttPublish = ({ topic, qos, payload }) => {
    if (client) {
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  const mqttSub = ({ topic }) => {
    if (client) {
      client.subscribe(topic, 0, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        console.log(`Subscribe to topics: ${topic}`);
        setIsSub(true);
      });
    }
  };

  const mqttUnSub = ({ topic }) => {
    if (client) {
      client.unsubscribe(topic, 0, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        console.log(`unsubscribed topic: ${topic}`);
        setIsSub(false);
      });
    }
  };

  return (
    <Space
      direction="vertical"
      size={20}
      style={{ display: "flex", padding: 20 }}
    >
      <MqttConnection
        connect={mqttConnect}
        disconnect={mqttDisconnect}
        connectBtn={connectStatus}
      />
      <MqttSubscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
      <MqttPublisher publish={mqttPublish} />
      <MqttReceiver payload={payload} />
    </Space>
  );
};

export default MqttModule;
