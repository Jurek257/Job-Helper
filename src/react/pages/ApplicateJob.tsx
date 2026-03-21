import { Header } from "@/react/sections/header";
import { useSearchParams } from "react-router-dom";
import { AddJobFormStep1 } from "../forms/addJobFormStep1";
import { GetInfoFromAiStep2 } from "../components/getInfoFromAiStep2";
import type { GenerateCoverLetterParams } from "@/types/types";
import { useEffect, useState } from "react";

export function ApplicateJobPage() {
  const [URLSearchParams] = useSearchParams();
  const [aplicationData, setAplicationData] =
    useState<GenerateCoverLetterParams>();

  const currentStep = Number(URLSearchParams.get("step"));

  useEffect(() => {
    console.log("aplicationData", aplicationData);
  }, [aplicationData]);

  return (
    <>
      <Header></Header>
      <div className="flex justify-center items-center mt-10">
        {currentStep === 1 ? (
          <AddJobFormStep1 setCoverLetterData={setAplicationData} />
        ) : aplicationData ? (
          <GetInfoFromAiStep2 data={aplicationData} />
        ) : (
          <div>...Loading</div>
        )}
      </div>
    </>
  );
}
