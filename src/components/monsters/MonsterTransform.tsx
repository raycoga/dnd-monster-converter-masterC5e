// src/App.tsx
import React, { useState } from "react";
import useMonsterHooks from "~/hooks/monsterHooks/useMonsterHooks";
import transformarStringAtaque from "~/utilities/monsterUtilities/transformarStringAtaque";
import JsonInput from "../JsonInput";
import XmlOutput from "../XmlOutput";
import { Col, Row } from "antd";

const Monstertransform: React.FC = () => {
  const [descriptionInfo, setdescriptionInfo] = useState("");
  const { xml, xmlRawObject, setXml, convertJsonToXml } = useMonsterHooks();

  const moreDataChange = (value: string) => {
    setdescriptionInfo(value);
  };

  const handleTransform = () => {
    xmlRawObject.ele("description", transformarStringAtaque(descriptionInfo));
    setXml(xmlRawObject.end({ pretty: true }));
  };

  return (
    <Row justify={"center"} gutter={[16, 16]}>
      <Col span={24}>
        <h1>Monsters</h1>
      </Col>

      <Col span={10}>
        <JsonInput
          onJsonChange={convertJsonToXml}
          moreDataChange={moreDataChange}
        />
      </Col>
      <Col span={4}>
        <Row justify={"center"}>
          <button style={{ height: "100vh" }} onClick={handleTransform}>
            transformar
          </button>
        </Row>
      </Col>
      <Col span={10}>
        <XmlOutput xml={xml} />
      </Col>
    </Row>
  );
};

export default Monstertransform;
