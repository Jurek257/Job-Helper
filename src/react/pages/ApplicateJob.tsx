import { Header } from "@/react/sections/header";
import { AddJobFormStep1 } from "../forms/addJobFormStep1";

export function ApplicateJobPage() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center mt-10">
        <AddJobFormStep1 />
      </div>
    </>
  );
}
