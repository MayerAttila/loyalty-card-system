"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { sendContactMessage } from "@/api/client/contact.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

type FormErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const nextMessage = String(formData.get("message") ?? "").trim();

    const nextErrors: FormErrors = {};
    if (!name) nextErrors.name = "Name is required.";
    if (!email || !EMAIL_REGEX.test(email)) {
      nextErrors.email = "A valid email is required.";
    }
    if (!subject) nextErrors.subject = "Subject is required.";
    if (!nextMessage) nextErrors.message = "Message is required.";
    if (nextMessage.length > MAX_MESSAGE_LENGTH) {
      nextErrors.message = `Message must be at most ${MAX_MESSAGE_LENGTH} characters.`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(
        Object.values(nextErrors)[0] ?? "Please fix the highlighted fields.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name,
        email,
        subject,
        message: nextMessage,
      });
      setErrors({});
      setMessage("");
      form.reset();
      toast.success("Your message has been sent.");
    } catch (error) {
      console.error("sendContactMessage failed", error);
      const maybeMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      const messageText =
        typeof maybeMessage === "string" && maybeMessage.trim()
          ? maybeMessage
          : "Unable to send your message right now.";
      toast.error(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold">Send us a message</h2>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <CustomInput
          id="name"
          type="name"
          placeholder="Your name"
          variant="glassy"
          errorText={errors.name}
          onChange={() => clearFieldError("name")}
        />
        <CustomInput
          id="email"
          type="email"
          placeholder="Your email"
          variant="glassy"
          errorText={errors.email}
          onChange={() => clearFieldError("email")}
        />
        <CustomInput
          id="subject"
          type="text"
          placeholder="Subject"
          variant="glassy"
          errorText={errors.subject}
          onChange={() => clearFieldError("subject")}
        />
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-semibold text-contrast/70"
          >
            Message
          </label>
          <div className="rounded-lg border border-accent-3/70 bg-primary/20 px-4 py-3 backdrop-blur-md focus-within:border-brand">
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                clearFieldError("message");
              }}
              placeholder="How can we help?"
              className="min-h-36 w-full resize-y bg-transparent text-sm text-contrast outline-none placeholder:text-contrast/50"
              maxLength={MAX_MESSAGE_LENGTH}
              required
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            {errors.message ? (
              <span className="text-xs text-brand">{errors.message}</span>
            ) : (
              <span className="text-xs text-contrast/65">
                Include as much detail as possible.
              </span>
            )}
            <span className="text-xs text-contrast/65">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
