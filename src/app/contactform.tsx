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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8">
      <h2 className="text-3xl font-bold">Contact Us</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className="input border border-gray-300"
          {...register("name", {
            required: true,
          })}
        />
        {errors.name && errors.name.type === "required" && (
          <p className="errorMsg">Name is required.</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          className="input border border-gray-300"
          {...register("email", {
            required: true,
            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
          })}
        />
        {errors.email && errors.email.type === "required" && (
          <p className="errorMsg">Email is required.</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p className="errorMsg">Email is not valid.</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Message</span>
        </label>
        <textarea
          placeholder="Your message"
          className="textarea h-24 border border-gray-300"
          {...register("message", {
            required: true,
          })}
        ></textarea>
        {errors.message && errors.message.type === "required" && (
          <p className="errorMsg">Message is required.</p>
        )}
      </div>
      <input
        type="hidden"
        {...register("site", {
          value: "whatgodsaysabout.me",
        })}
      />
      <div className="w-full flex justify-center">
        <button type="submit" className="btn btn-primary my-8 px-8">
          Send
        </button>
      </div>
      {sent && (
        <div className="w-full flex justify-center">
          <p className="text-black text-2xl bg-green-300 rounded-full px-8 py-4">
            Message sent!
          </p>
        </div>
      )}
      {error && (
        <div className="w-full flex justify-center">
          <p className="text-white text-2xl bg-red-500 rounded-full px-8 py-4">
            Failed to send message. Please try again.
          </p>
        </div>
      )}
    </form>
  );
}
