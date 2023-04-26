import React, { createContext, useEffect, useState } from "react";
import { Space } from "antd";
import MqttConnection from "./MqttConnection";
import MqttPublisher from "./MqttPublisher";
import MqttSubscriber from "./MqttSubscriber";
import MqttReceiver from "./MqttReceiver";
import mqtt from "mqtt/dist/mqtt";

export const QosOption = createContext([]);
const qosOption = [
  {
    label: "0",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
];

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

  const mqttSub = ({ topic, qos }) => {
    if (client) {
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        console.log(`Subscribe to topics: ${topic}`);
        setIsSub(true);
      });
    }
  };

  const mqttUnSub = ({ topic, qos }) => {
    if (client) {
      client.unsubscribe(topic, { qos }, (error) => {
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
    <QosOption.Provider value={qosOption}>
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
    </QosOption.Provider>
  );
};

export default MqttModule;
