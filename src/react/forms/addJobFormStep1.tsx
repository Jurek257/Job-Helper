import { useNavigate } from "react-router-dom";
import { useCardActions } from "../../hooks/useCardActions";
import { LoadingButton } from "../components/loading";
import { useState } from "react";
import type { GenerateCoverLetterParams } from "@/types/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import toast from "react-hot-toast";


interface Props {
  setCoverLetterData: (data: GenerateCoverLetterParams) => void;
}

export function AddJobFormStep1({ setCoverLetterData }: Props) {
  const navigate = useNavigate();
  const { addNewJobCard } = useCardActions();
  const URL = useSelector((state: RootState) => state.User.resumeURL);
  const isGuest = useSelector((state: RootState) => state.User.isGuest);

  const [isFormLoading, setFormLoading] = useState<boolean>(false);

  const extractFormData = (e: React.SyntheticEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    return {
      companyName: formData.get("company_name") as string,
      jobTitle: formData.get("position") as string,
      jobDescription: formData.get("job_description") as string,
    };
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isGuest) {
      await addCard(e);
      return;
    }

    const formData = extractFormData(e);
    const resumeUrl = URL;

    if (!resumeUrl) {
      toast.error("Please upload your resume in Profile before adding a job");
      return;
    }

    setCoverLetterData({ ...formData, resumeURL: resumeUrl });
    await addCard(e);
    navigate("/add-job?step=2");
  };

  const addCard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    setFormLoading(true);

    try {
      await addNewJobCard(e);
      toast.success("New application card added");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div className="w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
      <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
        <h2 className="text-[28px] font-bold">Add Job Aplication</h2>
        <p className="text-white/50">
          Track a new opportunity in your pipeline
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col justify-between"
        action=""
      >
        <div className="flex flex-col sm:flex-row">
          <label className="flex flex-col p-5 w-full sm:w-1/2" htmlFor="">
            <span className="font-bold">
              COMPANY NAME<span className="text-red-400">*</span>
            </span>
            <input
              type="text"
              name="company_name"
              required
              className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
            />
          </label>
          <label className="flex flex-col p-5 w-full sm:w-1/2" htmlFor="">
            <span className="font-bold">POSITION</span>
            <input
              type="text"
              name="position"
              className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
            />
          </label>
        </div>
        <label className="flex flex-col px-5  w-full" htmlFor="">
          <span className="font-bold">
            COMPANYS RECRUITING EMAIL
            <span className="text-white/40 font-normal text-sm ml-1">(optional)</span>
          </span>
          <input
            type="email"
            name="email"
            className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
          />
        </label>
        <label className="flex flex-col px-5 py-2 w-full" htmlFor="">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-bold">JOB REQUIREMENTS</span>
            <span className="text-white/40 font-normal text-sm">(optional — recommended for a more personalised cover letter)</span>
          </div>
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
                Submit
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
