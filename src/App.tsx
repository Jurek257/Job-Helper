import "./App.css";
import { useState, useEffect } from "react";
import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";
import type { cardProps, CardStatus as CardStatus } from "./types/types";

function App() {
  const [isPopupShowed, setPopupShowed] = useState(false);
  const [CardDataArr, HandleCardDataArr] = useState<cardProps[]>([]);

  const [draggedCardTimeId, setDraggedCardTimeId] = useState<Date>();

  useEffect(() => {
    CardDataArr.find((item) =>
      item.idTime === draggedCardTimeId ? console.log(item.status) : undefined,
    );

    console.log(`draggedCardTimeId :${draggedCardTimeId}`);
    console.log();
  }, [draggedCardTimeId]);

  useEffect(() => {
    console.log(CardDataArr);
  }, [CardDataArr]);

  const AddNewJobCard = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formJSObject = Object.fromEntries(formData);
    const status: CardStatus = "applied"; //temporary default value
    const newCard = {
      idTime: new Date(),
      status: status,
      ...formJSObject,
    } as cardProps;

    HandleCardDataArr((prev) => [...prev, newCard]);
    setPopupShowed(false);
  };

  const DeleteJobCard = (idTimeToDelete: Date) => {
    HandleCardDataArr((prev) =>
      prev.filter((item) => item.idTime !== idTimeToDelete),
    );
  };

  const changeCardstatus = (
    targetIdTime: Date | undefined,
    targetStatus: CardStatus,
  ) => {
    console.log("changeCardstatus func working");
    if (!targetIdTime) {
      console.log("idDate of drag card undefined");
      return;
    }

    HandleCardDataArr((prev) =>
      prev.map((item) =>
        item.idTime === targetIdTime ? { ...item, status: targetStatus } : item,
      ),
    );
  };

  return (
    <>
      <Header setPopupShowed={setPopupShowed} />
      <Dashboard
        jobJSdataArr={CardDataArr}
        DeleteCardFunc={DeleteJobCard}
        setDraggedCardTimeId={setDraggedCardTimeId}
        changeCardstatus={changeCardstatus}
        draggedCardTimeId={draggedCardTimeId}
      />
      <AddAplicationPopup
        isPopupShowed={isPopupShowed}
        setPopupShowed={setPopupShowed}
        handleForm={AddNewJobCard}
      />
    </>
  );
}
export default App;
