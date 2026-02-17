import "./App.css";

import { Header } from "./react/sections/header";
import { Dashboard } from "./react/sections/dashboard";
import { AddAplicationPopup } from "./react/components/addAplicationPopup";

function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <AddAplicationPopup />
    </>
  );
}

export default App;
