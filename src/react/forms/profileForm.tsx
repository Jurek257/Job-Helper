import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/supabase";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const profileSchema = z.object({
  name: z.string().min(2, "Name Value minimal 2 letters"),
  occupation: z.string().min(2, "must be your occupation"),
  resumeFile: z.any().optional(),
});

type ProfileFormProps = z.infer<typeof profileSchema>;

type ExistingProfile = {
  name: string;
  occupation: string;
  resume_url: string;
};

export function ProfileForm() {
  const [isFileUploading, setFileUploading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<ExistingProfile | null>(null);
  const { t } = useTranslation();

  const form = useForm<ProfileFormProps>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabaseClient
        .from("profiles")
        .select("name, occupation, resume_url")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setExistingProfile(data);
            form.reset({ name: data.name, occupation: data.occupation });
          }
        });
    });
  }, [form]);

  const ifResumeExistDelete = async (user: User) => {
    const { data } = await supabaseClient
      .from("profiles")
      .select("resume_url")
      .eq("user_id", user.id)
      .single();

    if (data?.resume_url) {
      const oldPath = data.resume_url.split("resume_storage/")[1];
      const { data: deletedFiles, error: deletingError } =
        await supabaseClient.storage.from("resume_storage").remove([oldPath]);
      if (deletingError) {
        toast.error(t("profile.toast_resume_required"));
        throw deletingError;
      }
      if (!deletedFiles || deletedFiles.length === 0) {
        toast.error(t("profile.toast_resume_required"));
        throw new Error("Old resume was not deleted");
      }
    }
  };

  const onSubmit = async (data: ProfileFormProps) => {
    setFileUploading(true);

    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        console.error("by form submit user is not defined");
        return;
      }

      const files: FileList | undefined = data.resumeFile;
      const hasNewFile = files && files.length > 0;

      if (hasNewFile) {
        const file = files[0];

        if (file.size > 1048576) {
          toast.error(t("profile.toast_file_size"));
          return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(t("profile.toast_file_type"));
          return;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `resumes/${user.id}/${fileName}`;

        await ifResumeExistDelete(user);

        const { error: uploadError } = await supabaseClient.storage
          .from("resume_storage")
          .upload(filePath, file);
        if (uploadError) {
          toast.error(t("profile.toast_resume_required"));
          throw uploadError;
        }

        const { data: urlData } = supabaseClient.storage
          .from("resume_storage")
          .getPublicUrl(filePath);

        const { error: dbError } = await supabaseClient.from("profiles").upsert(
          {
            user_id: user.id,
            name: data.name,
            occupation: data.occupation,
            resume_url: urlData.publicUrl,
          },
          { onConflict: "user_id" },
        );
        if (dbError) {
          toast.error(t("profile.toast_resume_required"));
          throw dbError;
        }
      } else {
        if (!existingProfile?.resume_url) {
          toast.error(t("profile.toast_resume_required"));
          return;
        }

        const { error: dbError } = await supabaseClient.from("profiles").upsert(
          {
            user_id: user.id,
            name: data.name,
            occupation: data.occupation,
            resume_url: existingProfile.resume_url,
          },
          { onConflict: "user_id" },
        );
        if (dbError) {
          toast.error(t("profile.toast_resume_required"));
          throw dbError;
        }
      }

      toast.success(t("profile.toast_success"));
    } catch (error) {
      console.error(error);
    } finally {
      setFileUploading(false);
    }
  };

  const existingFileName = existingProfile?.resume_url
    ? existingProfile.resume_url.split("/").pop()
    : null;

  return (
    <div className="justify-center items-center flex mt-10">
      <form
        className="flex w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] rounded-2xl p-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          {/* Name Field */}
          <Controller
            name="name"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel htmlFor="user-name">{t("profile.full_name")}</FieldLabel>{" "}
                <Input
                  {...field}
                  id="user-name"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("profile.name_placeholder")}
                />{" "}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Occupation */}
          <Controller
            name="occupation"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel htmlFor="occupation">
                  {t("profile.occupation")}
                </FieldLabel>{" "}
                <Input
                  {...field}
                  id="occupation"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("profile.occupation_placeholder")}
                />{" "}
                <FieldDescription>{t("profile.current_position")}</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Resume File Field */}
          <Controller
            name="resumeFile"
            control={form.control}
            render={({ field: { onChange, name, ref }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel htmlFor="resumeStorageURL">{t("profile.cv")}</FieldLabel>{" "}
                {existingFileName && (
                  <p className="text-sm text-white/50 mb-1">
                    {t("profile.current_file")} <span className="text-white/70">{existingFileName}</span>
                  </p>
                )}
                <Input
                  name={name}
                  ref={ref}
                  id="resumeStorageURL"
                  type="file"
                  accept=".pdf , .doc , .docx"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => onChange(e.target.files)}
                />{" "}
                {existingFileName && (
                  <FieldDescription>{t("profile.keep_file")}</FieldDescription>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isFileUploading}>
            {isFileUploading ? t("common.loading") : t("profile.save")}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
