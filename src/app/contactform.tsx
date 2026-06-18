"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
  site: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Message sent");
        setSent(true);
        setTimeout(() => {
          setTimeout(() => {
            reset();
            setSent(false);
          }, 500);
        }, 3000);
      } else {
        const error = await response.json();
        console.error("Error sending message:", error);
        setError(true);
      }
    } catch (error) {
      console.error("Error sending message", error);
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h2 className="sr-only">Contact Us</h2>
      <div className="mt-4 flex flex-col gap-1.5">
        <label className="text-sm font-bold text-ink">
          <span>Name</span>
        </label>
        <input
          type="text"
          className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink placeholder:text-mutedInk focus-ring"
          {...register("name", {
            required: true,
          })}
        />
        {errors.name && errors.name.type === "required" && (
          <p className="text-[13px] text-danger">Name is required.</p>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <label className="text-sm font-bold text-ink">
          <span>Email</span>
        </label>
        <input
          type="text"
          className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink placeholder:text-mutedInk focus-ring"
          {...register("email", {
            required: true,
            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
          })}
        />
        {errors.email && errors.email.type === "required" && (
          <p className="text-[13px] text-danger">Email is required.</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p className="text-[13px] text-danger">Email is not valid.</p>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1.5">
        <label className="text-sm font-bold text-ink">
          <span>Message</span>
        </label>
        <textarea
          placeholder="Your message"
          className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink placeholder:text-mutedInk focus-ring"
          {...register("message", {
            required: true,
          })}
        ></textarea>
        {errors.message && errors.message.type === "required" && (
          <p className="text-[13px] text-danger">Message is required.</p>
        )}
      </div>
      <input
        type="hidden"
        {...register("site", {
          value: "whatgodsaysabout.me",
        })}
      />
      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="mt-4 flex min-h-[48px] items-center justify-center rounded-full bg-ink px-8 text-base font-extrabold text-page disabled:opacity-50 focus-ring"
        >
          Send
        </button>
      </div>
      {sent && (
        <div className="w-full flex justify-center">
          <p className="mt-4 rounded-full bg-tint px-8 py-4 text-center text-lg font-bold text-ink">
            Message sent!
          </p>
        </div>
      )}
      {error && (
        <div className="w-full flex justify-center">
          <p className="mt-4 rounded-full bg-danger px-8 py-4 text-center text-lg font-bold text-page">
            Failed to send message. Please try again.
          </p>
        </div>
      )}
    </form>
  );
}
