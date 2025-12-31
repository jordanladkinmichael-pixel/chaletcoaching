"use client";

import React, { useMemo, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type FieldArrayPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Plus, X, Globe } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  H1,
  H2,
  Paragraph,
  Input,
} from "@/components/ui";
import { countries } from "@/lib/data/countries";
import { languages as languageOptions } from "@/lib/data/languages";
import { cn } from "@/lib/utils";

const experienceOptions = [
  { value: "1-2", label: "1–2 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "6-10", label: "6–10 years" },
  { value: "10+", label: "10+ years" },
];

const formSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  country: z.string().min(1, "Please select your country."),
  primaryFocus: z.string().min(2, "Please describe your primary focus."),
  experience: z.enum(["1-2", "3-5", "6-10", "10+"], {
    errorMap: () => ({ message: "Select your experience." }),
  }),
  languages: z
    .array(z.string())
    .min(1, "Select at least one language.")
    .max(10, "Please limit to 10 languages."),
  proofLinks: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Link is required")
        .refine(isValidUrl, "Enter a valid URL (http/https).")
    )
    .min(1, "Add at least one link.")
    .max(5, "Up to 5 links."),
  bio: z.string().min(200, "Please provide at least 200 characters."),
  notes: z.string().optional(),
  confirmAccuracy: z
    .boolean()
    .refine((val) => val === true, "Please confirm your information is accurate."),
  agreeTermsPrivacy: z
    .boolean()
    .refine((val) => val === true, "Please agree to Terms and Privacy."),
  company: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof formSchema>;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function BecomeCoachFormClient() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
      primaryFocus: "",
      experience: undefined,
      languages: [],
      proofLinks: [""],
      bio: "",
      notes: "",
      confirmAccuracy: false,
      agreeTermsPrivacy: false,
      company: "",
    },
  });

  const { fields, append, remove } = useFieldArray<FormValues, FieldArrayPath<FormValues>>({
    control,
    name: "proofLinks" as FieldArrayPath<FormValues>,
  });

  const selectedLanguages = watch("languages");
  const countryValue = watch("country");

  const filteredCountries = useMemo(() => {
    const query = countryValue?.toLowerCase() ?? "";
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [countryValue]);

  const [languageQuery, setLanguageQuery] = useState("");
  const filteredLanguages = useMemo(() => {
    const q = languageQuery.toLowerCase();
    return languageOptions.filter(
      (lang) =>
        !selectedLanguages?.includes(lang.code) &&
        (lang.name.toLowerCase().includes(q) || lang.code.includes(q))
    );
  }, [languageQuery, selectedLanguages]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/coach-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        return;
      }

      const data = await response.json().catch(() => null);
      if (response.status === 429) {
        setServerError(
          data?.error || "Too many requests right now. Please try again in 10 minutes."
        );
      } else if (response.status === 400) {
        setServerError(data?.error || "Validation error. Please check the form.");
      } else {
        setServerError(data?.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("coach application submit error", error);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = (code: string) => {
    const current = watch("languages") || [];
    if (current.includes(code)) {
      const next = current.filter((item) => item !== code);
      setValue("languages", next);
    } else {
      setValue("languages", [...current, code]);
    }
  };

  const setCountry = (code: string) => {
    const match = countries.find((c) => c.code === code);
    const value = match ? match.name : code;
    setValue("country", value);
  };

  const renderFieldError = (message?: string) =>
    message ? <p className="text-sm text-danger mt-1">{message}</p> : null;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <H1>Become a Coach</H1>
        <Paragraph className="text-lg">
          Join Chalet Coaching, reach athletes globally, and build coach-led programs
          powered by AI assistance.
        </Paragraph>
        <div className="grid gap-3 md:grid-cols-3 text-sm text-text-muted">
          <div className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 text-primary" />
            <span>We’ll review your profile and respond by email.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 text-primary" />
            <span>No DB storage in this flow — email-only handling.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 text-primary" />
            <span>Keep your proof links handy; at least one is required.</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <H2>Application form</H2>
          <Paragraph className="text-text-muted">
            Please complete all required fields. We’ll email you a confirmation and send a copy
            to our team.
          </Paragraph>
        </CardHeader>
        <CardContent className="space-y-6">
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {serverError}
            </div>
          )}

          {isSuccess ? (
            <div className="rounded-xl border border-border bg-surface px-6 py-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-lg font-semibold">Application received</p>
                  <p className="text-sm text-text-muted">
                    Thanks — we’ll review and email you.
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted">
                You can close this page or explore the rest of Chalet Coaching while we review.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Full name</label>
                  <Input
                    placeholder="Your name"
                    {...register("fullName")}
                    aria-invalid={!!errors.fullName}
                  />
                  {renderFieldError(errors.fullName?.message)}
                </div>
                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {renderFieldError(errors.email?.message)}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Country</label>
                  <div className="relative">
                    <Input
                      placeholder="Search country"
                      {...register("country")}
                      aria-invalid={!!errors.country}
                    />
                    <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-44 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
                      {filteredCountries.slice(0, 20).map((c) => (
                        <button
                          type="button"
                          key={c.code}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-hover",
                            c.name === countryValue && "bg-surface-hover"
                          )}
                          onClick={() => setCountry(c.code)}
                        >
                          <Globe size={14} className="text-text-muted" />
                          <span>{c.name}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="px-3 py-2 text-sm text-text-muted">No matches</div>
                      )}
                    </div>
                  </div>
                  {renderFieldError(errors.country?.message)}
                </div>
                <div>
                  <label className="text-sm font-semibold">Primary focus</label>
                  <Input
                    placeholder="e.g., Strength & conditioning"
                    {...register("primaryFocus")}
                    aria-invalid={!!errors.primaryFocus}
                  />
                  {renderFieldError(errors.primaryFocus?.message)}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Experience</label>
                  <div className="rounded-xl border border-border bg-surface p-1">
                    <Controller
                      name="experience"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {experienceOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={cn(
                                "rounded-lg border px-3 py-2 text-sm",
                                field.value === option.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:bg-surface-hover"
                              )}
                              onClick={() => field.onChange(option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                  {renderFieldError(errors.experience?.message)}
                </div>

                <div>
                  <label className="text-sm font-semibold">Languages</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedLanguages?.map((code) => {
                        const lang = languageOptions.find((l) => l.code === code);
                        return (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-sm border border-border"
                          >
                            {lang?.name || code}
                            <button
                              type="button"
                              className="text-text-muted hover:text-text"
                              onClick={() => toggleLanguage(code)}
                              aria-label={`Remove ${lang?.name || code}`}
                            >
                              <X size={14} />
                            </button>
                          </span>
                        );
                      })}
                      {(!selectedLanguages || selectedLanguages.length === 0) && (
                        <span className="text-sm text-text-muted">
                          Select at least one language
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        placeholder="Search languages"
                        value={languageQuery}
                        onChange={(e) => setLanguageQuery(e.target.value)}
                        aria-invalid={!!errors.languages}
                      />
                      <div className="absolute inset-x-0 top-full z-10 mt-1 max-h-44 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
                        {filteredLanguages.slice(0, 20).map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-hover"
                            onClick={() => toggleLanguage(lang.code)}
                          >
                            <span>{lang.name}</span>
                            <span className="text-text-muted text-xs">{lang.code}</span>
                          </button>
                        ))}
                        {filteredLanguages.length === 0 && (
                          <div className="px-3 py-2 text-sm text-text-muted">No matches</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {renderFieldError(errors.languages?.message)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Proof links (1–5)</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append("")}
                    disabled={fields.length >= 5}
                  >
                    <Plus size={16} />
                    Add link
                  </Button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3">
                      <Input
                        placeholder="https://"
                        {...register(`proofLinks.${index}` as const)}
                        aria-invalid={!!errors.proofLinks?.[index]}
                      />
                      <button
                        type="button"
                        className="text-text-muted hover:text-danger"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        aria-label="Remove link"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {renderFieldError(
                  Array.isArray(errors.proofLinks)
                    ? errors.proofLinks.find(Boolean)?.message
                    : errors.proofLinks?.message
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-semibold">Bio (min 200 chars)</label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-bg"
                    rows={6}
                    {...register("bio")}
                    aria-invalid={!!errors.bio}
                  />
                  {renderFieldError(errors.bio?.message)}
                </div>

                <div>
                  <label className="text-sm font-semibold">Notes (optional)</label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-bg"
                    rows={4}
                    {...register("notes")}
                  />
                  {renderFieldError(errors.notes?.message)}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Consents</label>
                <div className="space-y-2 text-sm text-text">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-focus"
                      {...register("confirmAccuracy")}
                    />
                    <span>I confirm the information provided is accurate.</span>
                  </label>
                  {renderFieldError(errors.confirmAccuracy?.message)}

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-focus"
                      {...register("agreeTermsPrivacy")}
                    />
                    <span>
                      I agree to the{" "}
                      <a className="text-primary hover:underline" href="/legal/terms">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a className="text-primary hover:underline" href="/legal/privacy">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {renderFieldError(errors.agreeTermsPrivacy?.message)}
                </div>
              </div>

              <input
                type="text"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />

              <CardFooter className="flex flex-col items-start gap-3 border-t border-border/60 pt-4">
                <Button type="submit" isLoading={isSubmitting}>
                  Submit application
                </Button>
                <p className="text-xs text-text-muted">
                  We respond by email; no timelines promised. For urgent questions, contact
                  info@chaletcoaching.co.uk.
                </p>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-semibold">Privacy first</p>
            <p className="text-sm text-text-muted">
              We use your data only to review your application. No database storage in this
              flow; emails only. See our{" "}
              <a className="text-primary hover:underline" href="/legal/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm font-semibold">Need help?</p>
            <p className="text-sm text-text-muted">
              Email us at info@chaletcoaching.co.uk or visit{" "}
              <a className="text-primary hover:underline" href="/faq">
                FAQ
              </a>{" "}
              for common questions.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <H2 className="text-lg">FAQ</H2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">When will I hear back?</p>
            <p className="text-sm text-text-muted">
              We review applications and reply by email. We do not promise timelines.
            </p>
          </div>
          <div>
            <p className="font-semibold">Do I need certifications?</p>
            <p className="text-sm text-text-muted">
              Relevant coaching experience or credentials are strongly preferred.
            </p>
          </div>
          <div>
            <p className="font-semibold">Can I update my info later?</p>
            <p className="text-sm text-text-muted">
              Yes—reply to the confirmation email with any updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

