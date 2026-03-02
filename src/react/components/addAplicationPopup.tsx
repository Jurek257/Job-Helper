import { LoadingButton } from "./loading";
interface PopupProps {
  isPopupShowed: boolean;
  setPopupShowed: (state: boolean) => void;
  handleForm: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  isFormLoading: boolean;
}

export function AddAplicationPopup({
  isPopupShowed,
  setPopupShowed,
  handleForm,
  isFormLoading,
}: PopupProps) {
  if (isPopupShowed)
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-2">
        <div className=" w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
          <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
            <h2 className="text-[28px] font-bold">Add Job Aplication</h2>
            <p className="text-white/50">
              Track a new opportunity in your pipeline
            </p>
          </div>

          <form
            onSubmit={handleForm}
            className="w-full h-full flex flex-col justify-between"
            action=""
          >
            <div className="flex">
              <label className="flex flex-col p-5 w-1/2" htmlFor="">
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
              <label className="flex flex-col p-5 w-1/2" htmlFor="">
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
                COMPANYS RECRUITING EMAIL<span className="text-red-400">*</span>
              </span>
              <input
                type="email"
                name="email"
                required
                className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
              />
            </label>
            <label className="flex flex-col px-5 py-2 w-full" htmlFor="">
              <span className="font-bold">SHORT JOB DESCRIPTION</span>
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
                    onClick={() => setPopupShowed(false)}
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
      </div>
    );
}
