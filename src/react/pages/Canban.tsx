import { useState } from "react";
import { Header } from "../sections/header";
import { Dashboard } from "../sections/dashboard";
import { AddAplicationPopup } from "../components/addAplicationPopup";

export function Canban() {
  const [isPopupShowed, setPopupShowed] = useState(false);

  return (
    <div className="">
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
      />
    </div>
  );
}
