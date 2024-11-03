"use client";
import { useState } from "react";

interface ErrorObject {
  contactName?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showThanksModal, setShowThanksModal] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<ErrorObject>({});

  function sendMessage() {
    // check for errors / empty
    let currentErrors = { ...errors };
    if (contactName === "") {
      currentErrors.contactName = "Your forgot your name?";
    } else {
      delete currentErrors.contactName;
    }
    if (email === "" || !email.includes("@")) {
      currentErrors.email = "Please let me know where to email a response.";
    } else {
      delete currentErrors.email;
    }
    if (message === "") {
      currentErrors.message = "You forgot to include a message.";
    } else {
      delete currentErrors.message;
    }
    setErrors(currentErrors);

    if (Object.values(currentErrors).every((x) => x === null)) {
      console.log(currentErrors);
      // No errors
      // send to Slack
      const payload = {
        name: contactName,
        email: email,
        message: message,
        site: "WhatGodSaysAbout.me",
      };

      return fetch("https://whatgodsaysabout.me/contact/slack/send", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
      })
        .then((res) => {
          setShowThanksModal(true);

          setContactName("");
          setEmail("");
          setMessage("");
          return;
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    } else {
      console.log(errors);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 text-gray-400 hover:text-white"
      >
        Contact
      </button>
      {showModal && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
              <div className="grow mx-2 mb-2 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    {showThanksModal ? (
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Thanks!
                        </h3>
                        <div className="mt-2">
                          <p className="col-span-12">
                            I sincerely appreciate your feedback and will
                            respond to questions as soon as I'm able to.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Questions or Comments?
                        </h3>
                        <div className="mt-2">
                          <div className="col-span-12">
                            <label
                              htmlFor="contact-name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              name="contact-name"
                              id="contact-name"
                              autoComplete="name"
                              className={`p-2 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors.contactName
                                  ? "border-4 border-red-500"
                                  : "border border-gray-300"
                              }`}
                            />
                          </div>
                          <div className="mt-2 col-span-12">
                            <label
                              htmlFor="email-address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              name="email-address"
                              id="email-address"
                              autoComplete="email"
                              className={`p-2 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors.email
                                  ? "border-4 border-red-500"
                                  : "border border-gray-300"
                              }`}
                            />
                          </div>
                          <div className="mt-2 col-span-12">
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Message
                            </label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              name="message"
                              id="message"
                              className={`p-2 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                errors.message
                                  ? "border-4 border-red-500"
                                  : "border border-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {showThanksModal ? (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowThanksModal(false);
                      }}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      OK
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={sendMessage}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setShowThanksModal(false);
                          setErrors({});
                        }}
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
