"use client";

import { useForm } from "react-hook-form";
import type { jobFormProps } from "@/types/types";

export function JobApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<jobFormProps>();
  const onSubmit = (data: jobFormProps) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Company Name"
        {...register("companyName", { required: true, max: 50, min: 2 })}
      />
      <input
        type="text"
        placeholder="Position"
        {...register("position", { required: true })}
      />
      {/*  <input type="text" placeholder="Recruiting Email" {...register} /> */}
      <input
        type="url"
        placeholder="URL for Original Posting"
        {...register("PostURL", { required: true })}
      />

      <textarea
        {...register("jobDescription", {
          required: true,
          max: 1000,
          min: 2,
          maxLength: 1000,
        })}
      />

      <input type="submit" />
    </form>
  );
}
