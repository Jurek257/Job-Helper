import { Header } from "../sections/header";
import { Dashboard } from "../sections/dashboard";
import { useOnboarding } from "@/hooks/useOnboarding";

export function Canban() {
  useOnboarding();
  return (
    <div className="">
      <Header />
      <Dashboard />
    </div>
  );
}
