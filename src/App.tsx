import "./App.css";
import { useState } from "react";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";

function App() {
  const [isPopupShowed, setPopupShowed] = useState(false);
  return (
    <>
      <Header setPopupShowed={setPopupShowed}/>
      <Dashboard />
      <AddAplicationPopup isPopupShowed={isPopupShowed} setPopupShowed={setPopupShowed}/>
    </>
  );
}

export default App;
