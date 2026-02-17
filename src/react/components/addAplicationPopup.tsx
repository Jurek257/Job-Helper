import { useState } from "react";

export function AddAplicationPopup() {
  const [isPopupShowed, setPopupShowed] = useState(false);
  setPopupShowed;
  isPopupShowed;

  /* if (isPopupShowed)  */ return (
    <div className="fixed inset-0 top-1/2 left-1/2 -translate-1/2 bg-red-200">
      <form action="">
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
