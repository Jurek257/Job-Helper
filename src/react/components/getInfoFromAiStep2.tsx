import { LoadingButton } from "./loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function GetInfoFromAiStep2 () 
{
  const navigate = useNavigate();
const [isFormLoading, setFormLoading] = useState<boolean>(false);
return(
<div className="w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
          <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
            <h2 className="text-[28px] font-bold">Add Job Aplication</h2>
            <p className="text-white/50">
              Track a new opportunity in your pipeline
            </p>
          </div>

          <form
            /* onSubmit={handleSubmit} */
            className="w-full h-full flex flex-col justify-between"
            action=""
          >
              <p className="font-bold">Generate a Cover letter for this application</p>

            <label className="flex flex-col px-5 py-2 w-full" htmlFor="">
              <span className="font-bold">Additional Context (Optional)</span>
              <textarea
                name="job_description"
                id=""
                className="border focus:outline-none rounded-md border-white/20 pl-3 h-22"
              ></textarea>
            </label>
            <div className="flex m-3 self-end gap-3">
              {isFormLoading ? (
                <LoadingButton />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="bg-[var(--surface-color)] border border-[var(--border-color)] cursor-pointer text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 shadow-2xl shadow-blue-500/50 text-white px-6 py-2 cursor-pointer rounded-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    Generate
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
);}