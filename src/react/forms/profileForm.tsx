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
        toast.error("Problem with deleting old resume");
        throw deletingError;
      }
      if (!deletedFiles || deletedFiles.length === 0) {
        toast.error("Old resume was not deleted");
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
          toast.error("File must be less than 1 MB");
          return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error("Only PDF, DOC, DOCX files allowed");
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
          toast.error("Upload to storage Error");
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
          toast.error("Align url to database error");
          throw dbError;
        }
      } else {
        if (!existingProfile?.resume_url) {
          toast.error("Please upload your resume");
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
          toast.error("Align url to database error");
          throw dbError;
        }
      }

      toast.success("Sucessfully");
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
                <FieldLabel htmlFor="user-name">Full Name</FieldLabel>{" "}
                <Input
                  {...field}
                  id="user-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Example : John Kamerman"
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
                  Your Occupation
                </FieldLabel>{" "}
                <Input
                  {...field}
                  id="occupation"
                  aria-invalid={fieldState.invalid}
                  placeholder="Example : Fullstack Java Developer"
                />{" "}
                <FieldDescription>Your current position</FieldDescription>
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
                <FieldLabel htmlFor="resumeStorageURL">Your CV</FieldLabel>{" "}
                {existingFileName && (
                  <p className="text-sm text-white/50 mb-1">
                    Current file: <span className="text-white/70">{existingFileName}</span>
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
                  <FieldDescription>Leave empty to keep the current file</FieldDescription>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isFileUploading}>
            {isFileUploading ? "Loading..." : "Save Profile"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
