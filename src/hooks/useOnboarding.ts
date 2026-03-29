import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const ONBOARDING_KEY = "jh_onboarding_done";

export function useOnboarding() {
  useEffect(() => {
    if (localStorage.getItem(ONBOARDING_KEY)) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "#000",
      overlayOpacity: 0.7,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Got it!",
      steps: [
        {
          element: "#onboarding-add-btn",
          popover: {
            title: "Add a new application",
            description: "Click here to add a new job you applied to. Fill in the company, position and job description.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#onboarding-tabs",
          popover: {
            title: "Track your status",
            description: "Switch between Applied, Rejected and Interview tabs to see your applications by status.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#onboarding-avatar",
          popover: {
            title: "Your profile",
            description: "Upload your CV here — it will be used to generate personalised cover letters automatically.",
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
