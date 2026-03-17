
import { Header } from "@/react/sections/header";
import { useSearchParams } from "react-router-dom";
import { AddJobFormStep1 } from "../forms/addJobFormStep1";
import { GetInfoFromAiStep2 } from "../components/getInfoFromAiStep2";
export function ApplicateJobPage() {

  const [URLSearchParams] = useSearchParams();


  const currentStep = Number(URLSearchParams.get("step"));

  
  return (
    <>
      <Header></Header>
      <div className="flex justify-center items-center mt-10">
{/* <AddJobFormStep1 /> */}
        {currentStep === 1 ? <AddJobFormStep1 /> : <GetInfoFromAiStep2 />}
      </div>
    </>
  );
}
