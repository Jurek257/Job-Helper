import { Loading } from "./loading";
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
      <div className="fixed inset-0 bg-black/50 z-2">
        <div className=" fixed inset-0 top-1/2 left-1/2 -translate-1/2 h-auto bg-white rounded-md drop-shadow-x1 z-5">
          <form
            onSubmit={handleForm}
            className="w-full h-full flex flex-col justify-between"
            action=""
          >
            <div className="flex">
              <label className="flex flex-col p-5 w-1/2" htmlFor="">
                <span className="">Company name*</span>
                <input
                  type="text"
                  name="company_name"
                  required
                  className="border rounded-md border-gray-500 h-10 pl-3"
                />
              </label>
              <label className="flex flex-col p-5 w-1/2" htmlFor="">
                <span className="">Position</span>
                <input
                  type="text"
                  name="position"
                  className="border rounded-md border-gray-500 h-10 pl-3"
                />
              </label>
            </div>
            <label className="flex flex-col px-5  w-full" htmlFor="">
              <span className="">Companys Recruiting Email*</span>
              <input
                type="email"
                name="email"
                required
                className="border rounded-md border-gray-500 h-8 pl-3"
              />
            </label>
            <label className="flex flex-col px-5 py-2 w-full" htmlFor="">
              <span className="">Short Job Description</span>
              <textarea
                name="job_description"
                id=""
                className="border rounded-md border-gray-500 pl-3 h-22"
              ></textarea>
            </label>
            <div className="flex m-3 self-end gap-3">
              {isFormLoading ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setPopupShowed(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg"
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
