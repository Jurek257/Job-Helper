import { useNavigate } from "react-router-dom";
import { useCardActions } from "../../hooks/useCardActions";
import { LoadingButton } from "../components/loading";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { createChat } from "@/services/coverLetterChatService";

interface Props {
  setCoverLetterData?: (data: unknown) => void;
}

export function AddJobFormStep1({ setCoverLetterData: _ }: Props) {
  const navigate = useNavigate();
  const { addNewJobCard } = useCardActions();
  const resumeURL = useSelector((state: RootState) => state.User.resumeURL);
  const isGuest = useSelector((state: RootState) => state.User.isGuest);
  const { t } = useTranslation();

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
    setFormLoading(true);

    try {
      // Для гостей — просто добавляем карточку и уходим на главную
      if (isGuest) {
        await addNewJobCard(e);
        toast.success(t("add_job.toast_success"));
        navigate("/");
        return;
      }

      if (!resumeURL) {
        toast.error(t("add_job.toast_resume"));
        return;
      }

      const formData = extractFormData(e);

      // Добавляем карточку в канбан и создаём чат параллельно
      const [, chatId] = await Promise.all([
        addNewJobCard(e),
        createChat({
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          jobDescription: formData.jobDescription,
          resumeUrl: resumeURL,
        }),
      ]);

      toast.success(t("add_job.toast_success"));
      // Переходим на страницу чата; autoGenerate запускает генерацию сразу
      navigate(`/cover-letter/${chatId}`, { state: { autoGenerate: true } });
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div className="w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] border-t-3 border-t-blue-500 rounded-2xl drop-shadow-x1 z-5">
      <div className="bg-blue-500/20 px-5 py-5 rounded-t-2xl border-b-3 border-b-[var(--border-color)]">
        <h2 className="text-[28px] font-bold">{t("add_job.title")}</h2>
        <p className="text-white/50">{t("add_job.subtitle")}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col justify-between"
        action=""
      >
        <div className="flex flex-col sm:flex-row">
          <label className="flex flex-col p-5 w-full sm:w-1/2" htmlFor="">
            <span className="font-bold">
              {t("add_job.company_name")}<span className="text-red-400">*</span>
            </span>
            <input
              type="text"
              name="company_name"
              required
              className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
            />
          </label>
          <label className="flex flex-col p-5 w-full sm:w-1/2" htmlFor="">
            <span className="font-bold">{t("add_job.position")}</span>
            <input
              type="text"
              name="position"
              className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
            />
          </label>
        </div>
        <label className="flex flex-col px-5  w-full" htmlFor="">
          <span className="font-bold">
            {t("add_job.email")}
            <span className="text-white/40 font-normal text-sm ml-1">({t("common.optional")})</span>
          </span>
          <input
            type="email"
            name="email"
            className="border focus:outline-none rounded-md border-white/20 h-10 pl-3"
          />
        </label>
        <label className="flex flex-col px-5 py-2 w-full" htmlFor="">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-bold">{t("add_job.job_requirements")}</span>
            <span className="text-white/40 font-normal text-sm">({t("add_job.optional_hint")})</span>
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
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="bg-blue-500 shadow-2xl shadow-blue-500/50 text-white px-6 py-2 cursor-pointer rounded-lg hover:-translate-y-1 transition-all duration-200"
              >
                {t("common.submit")}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
