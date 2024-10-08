// src/App.tsx
import React, { useState } from "react";
import JsonInput from "./JsonInput";
import XmlOutput from "./XmlOutput";
import transformarStringAtaque from "./utilities/monsterUtilities/transformarStringAtaque";
import useMonsterHooks from "./hooks/monsterHooks/useMonsterHooks";

const App: React.FC = () => {
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
    <div>
      <h1>JSON to XML Converter for Game Master 5</h1>
      <div className="body">
        <JsonInput
          onJsonChange={convertJsonToXml}
          moreDataChange={moreDataChange}
        />
        <button onClick={handleTransform}>transformar</button>
        <XmlOutput xml={xml} />
      </div>
    </div>
  );
};

export default App;
