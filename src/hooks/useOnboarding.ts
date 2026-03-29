import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import i18n from "../i18n";

const ONBOARDING_KEY = "jh_onboarding_done";

export function useOnboarding() {
  useEffect(() => {
    if (localStorage.getItem(ONBOARDING_KEY)) return;

    const t = (key: string) => i18n.t(key);

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "#000",
      overlayOpacity: 0.7,
      nextBtnText: t("onboarding.next"),
      prevBtnText: t("onboarding.back"),
      doneBtnText: t("onboarding.done"),
      steps: [
        {
          element: "#onboarding-add-btn",
          popover: {
            title: t("onboarding.step1_title"),
            description: t("onboarding.step1_desc"),
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#onboarding-tabs",
          popover: {
            title: t("onboarding.step2_title"),
            description: t("onboarding.step2_desc"),
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#onboarding-avatar",
          popover: {
            title: t("onboarding.step3_title"),
            description: t("onboarding.step3_desc"),
            side: "bottom",
            align: "end",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
      },
    });

    const timer = setTimeout(() => driverObj.drive(), 800);
    return () => clearTimeout(timer);
  }, []);
}
