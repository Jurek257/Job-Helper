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
import { useState } from "react";
import { supabaseClient } from "@/supabase";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
//import type { ProfileFormProps } from "@/types/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name Value minimal 2 letters"),
  occupation: z.string().min(2, "must be your occupation"),
  resumeFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload your resume")
    .refine((files) => files[0]?.size <= 1048576, "File must be less than 1 mb")
    .refine((files) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(files[0]?.type);
    }, "Only PDF , DOC , DOCX files allowed"),
});

type ProfileFormProps = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isFileUploading, setFileUploading] = useState(false);

  const form = useForm<ProfileFormProps>({
    resolver: zodResolver(profileSchema),
  });

  const ifResumeExistDelete = async (user: User) => {
    const { data } = await supabaseClient
      .from("profiles")
      .select("resume_url")
      .eq("user_id", user.id)
      .single();

    if (data?.resume_url) {
      const oldPath = data.resume_url.split("resume_storage/")[1];

      const { data: session } = await supabaseClient.auth.getSession();
      console.log("session:", session);
      const { data: deletedFiles, error: deletingError } =
        await supabaseClient.storage.from("resume_storage").remove([oldPath]);
      if (deletingError) {
        toast.error("Problem with deleting old resume");
        throw deletingError;
      }
      if (!deletedFiles || deletedFiles.length === 0) {
        toast.error("Old resume was not deleted");
        console.log("deletedFiles:", deletedFiles);
        console.log("deletingError:", deletingError);
        throw new Error("Old resume was not deleted");
      }
    }
  };

  const onSubmit = async (data: ProfileFormProps) => {
    console.log(data);
    setFileUploading(true);

    try {
      const file = data.resumeFile[0];

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        console.error("by form submit user is not defined");
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

      const { data: urlData } = await supabaseClient.storage
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

      toast.success("Sucessfully");
    } catch (error: any) {
      console.error(error);
    } finally {
      setFileUploading(false);
    }
  };

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

          {/* Resume Url Field */}
          <Controller
            name="resumeFile"
            control={form.control}
            render={({
              field: { onChange, value, ...restField },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                {" "}
                <FieldLabel htmlFor="resumeStorageURL">Your CV</FieldLabel>{" "}
                <Input
                  {...restField}
                  id="resumeStorageURL"
                  type="file"
                  accept=".pdf , .doc , .docx"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com/resume.pdf"
                  onChange={(e) => onChange(e.target.files)}
                />{" "}
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
