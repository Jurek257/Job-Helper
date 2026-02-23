import "./App.css";
import { useState } from "react";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";
import type { cardProps } from "./types/types";

export  type Action = "cancel" | "submit";
function App() {
  const [isPopupShowed, setPopupShowed] = useState(false);
  const [cardDataArr, AddCardDataArr] = useState<cardProps[]>([]);

  const AddNewJobCard = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formJSObject = Object.fromEntries(formData);

    const newCard = { idTime: new Date(), ...formJSObject } as cardProps;

    AddCardDataArr((prev) => [...prev, newCard]);
    setPopupShowed(false);
  };

  return (
    <>
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard jobJSdataArr={cardDataArr} />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
        handleForm={AddNewJobCard}
      />
    </>
  );
}
export default App;
