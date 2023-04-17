import React, { useCallback, useContext, useEffect } from "react";
import { PeerContext } from "@cerc-io/react-peer";
import "./utils/installBuffer";
import QueryParamsRoute from "./views/RoutableArea";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import CheckPhisherStatus from "./views/CheckPhisherStatus";
import HeaderBox from "./views/HeaderBox";
import InstallExtension from "./views/InstallExtension";
import FooterBox from "./views/FooterBox";
import { MOBYMASK_TOPIC } from "./utils/constants";

function App() {
  const peer = useContext(PeerContext);

  const handleTopicMessage = useCallback((peerId, data) => {
    console.log("Message from peer:", peerId.toString())
    console.log("Signed invocations")
    console.log(data)
  })

  useEffect(() => {
    if (peer) {
      const unsubscribe = peer.subscribeTopic(MOBYMASK_TOPIC, handleTopicMessage);

      return unsubscribe;
    }
  }, [peer, handleTopicMessage]);

  return (
    <div className="App">
      <Toaster />
      <HeaderBox />
      <CheckPhisherStatus />
      <HashRouter>
        <QueryParamsRoute />
      </HashRouter>

      <InstallExtension />
      <FooterBox />
    </div>
  );
}

export default App;
