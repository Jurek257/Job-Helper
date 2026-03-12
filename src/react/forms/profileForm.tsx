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
//import type { ProfileFormProps } from "@/types/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name Value minimal 2 letters"),
  occupation: z.string().min(2, "must be your occupation"),
  resumeFile : z.instanceof(FileList).refine((files) => files.length > 0 , "Please upload your resume").refine((files) => files[0]?.size <= 1048576 , "File must be less than 1 mb" ).refine((files) => {}),
});

type ProfileFormProps = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const form = useForm<ProfileFormProps>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", occupation: "", resumeStorageURL: "" },
  });

  const onSubmit = (data: ProfileFormProps) => console.log(data);
  console.error(form.formState.errors);

  return (
<div className="justify-center items-center flex mt-10">

    <form className="flex w-full sm:w-[800px] h-auto bg-[var(--surface-color)]  border border-[var(--border-color)] rounded-2xl p-5" onSubmit={form.handleSubmit(onSubmit)}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            <FieldLabel htmlFor="occupation">Your Occupation</FieldLabel>{" "}
            <Input
              {...field}
              id="occupation"
              aria-invalid={fieldState.invalid}
              placeholder="Example : Fullstack Java Developer"
            />{" "}
            <FieldDescription>Your current position</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
        />

      {/* Resume Url Field */}
      <Controller
        name="resumeStorageURL"
        control={form.control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {" "}
            <FieldLabel htmlFor="resumeStorageURL">
              Your CV
            </FieldLabel>{" "}
            <Input
              {...field}
              id="resumeStorageURL"
              aria-invalid={fieldState.invalid}
              placeholder="https://example.com/resume.pdf"
            />{" "}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
        />
<Button type="submit">Save Profile</Button>
        </FieldGroup>
    </form>
</div>
  );
}
/* 
 <input
        type="text"
        placeholder="Name Surname"
        {...register("name", { required: true })}
      />
      <input
        type="text"
        placeholder="currentRole"
        {...register("occupation", { required: true })}
      />
      <input
        type="url"
        placeholder="Resume Storage URL"
        {...register("resumeStorageURL", { required: true })}
      />

      <input type="submit" /> */
