"use client";

import { useState } from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const SANTO_EMAIL = "santo@santo-hp.co.jp";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState("");
  const [gmailUrl, setGmailUrl] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const company = data.get("company") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const type = data.get("type") as string;
    const message = data.get("message") as string;

    // <option> の value は英語スラッグなので、メールには翻訳済みラベルを使う
    const typeLabels: Record<string, string> = {
      jobseeker: t("typeJobseeker"),
      employer: t("typeEmployer"),
      other: t("typeOther"),
    };
    const typeLabel = typeLabels[type] ?? type;

    const subject = t("mailSubject", { type: typeLabel });
    const body = [
      `${t("nameLabel")}: ${name}`,
      company ? `${t("companyLabel")}: ${company}` : "",
      `${t("emailFormLabel")}: ${email}`,
      phone ? `${t("phoneFormLabel")}: ${phone}` : "",
      `${t("typeLabel")}: ${typeLabel}`,
      "",
      `${t("messageLabel")}:`,
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const encSubject = encodeURIComponent(subject);
    const encBody = encodeURIComponent(body);
    const isGmailUser = /@(gmail|googlemail)\.com\s*$/i.test(email.trim());

    const nextMailtoUrl = `mailto:${SANTO_EMAIL}?subject=${encSubject}&body=${encBody}`;
    const nextGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        SANTO_EMAIL
      )}&su=${encSubject}&body=${encBody}`;

    setMailtoUrl(nextMailtoUrl);
    setGmailUrl(nextGmailUrl);
    setSubmitted(true);
    if (isGmailUser) {
      window.open(nextGmailUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = nextMailtoUrl;
    }
  };

  return (
    <>
      <PageHeader label={t("pageLabel")} title={t("pageTitle")} subtitle={t.rich("pageSubtitle", { br: () => <br className="sm:hidden" /> })} image="/images/contact_hero.png" largeSubtitle />

      <section className="py-8 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            {/* Contact Info */}
            <div>
              <p className="mb-3 text-[11px] font-black tracking-[0.25em] text-santo-light sm:mb-6">
                INFO
              </p>
              <div className="space-y-0">
                {[
                  {
                    icon: Phone,
                    label: t("phoneLabel"),
                    value: t("phoneValue"),
                    href: "tel:0463-24-1722",
                    large: true,
                  },
                  {
                    icon: Mail,
                    label: t("emailLabel"),
                    value: t("emailValue"),
                  },
                  {
                    icon: Clock,
                    label: t("hoursLabel"),
                    value: t("hoursValue"),
                    note: t("hoursNote"),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0 sm:gap-4 sm:py-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-santo-sky">
                      <item.icon className="h-5 w-5 text-santo-blue" />
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-black tracking-[0.15em] text-slate-400">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-lg font-black tracking-wider text-santo-navy"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[13px] font-bold text-slate-700">
                          {item.value}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded border-2 border-santo-blue/30 bg-santo-sky/40 p-6 text-center sm:p-10">
                  <h2 className="mb-3 text-xl font-black tracking-wider text-santo-navy">
                    {t("thankYouTitle")}
                  </h2>
                  <p className="text-[13px] leading-[1.8] text-slate-700">
                    {t("thankYouDesc")}
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={mailtoUrl}
                      className="inline-flex h-11 items-center justify-center rounded bg-santo-navy px-5 text-[13px] font-black tracking-wider text-white transition hover:bg-santo-blue"
                    >
                      {t("submitButton")}
                    </a>
                    <a
                      href={gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded border-2 border-santo-blue bg-white px-5 text-[13px] font-black tracking-wider text-santo-blue transition hover:bg-santo-sky"
                    >
                      Gmail
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <p className="text-[13px] text-slate-500">
                    {t("formIntro")}
                    <span className="font-bold text-red-500"> *</span>
                    {t("required")}
                  </p>

                  <div className="grid gap-3 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="name"
                        className="mb-2 text-[12px] font-black tracking-wider"
                      >
                        {t("nameLabel")}
                        <span className="text-red-500"> *</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder={t("namePlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="company"
                        className="mb-2 text-[12px] font-black tracking-wider"
                      >
                        {t("companyLabel")}
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder={t("companyPlaceholder")}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 text-[12px] font-black tracking-wider"
                      >
                        {t("emailFormLabel")}
                        <span className="text-red-500"> *</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={t("emailPlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="mb-2 text-[12px] font-black tracking-wider"
                      >
                        {t("phoneFormLabel")}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="type"
                      className="mb-2 text-[12px] font-black tracking-wider"
                    >
                      {t("typeLabel")}
                      <span className="text-red-500"> *</span>
                    </Label>
                    <select
                      id="type"
                      name="type"
                      required
                      className="flex h-11 w-full rounded border border-input bg-background px-3 py-2 text-[13px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">{t("typeDefault")}</option>
                      <option value="jobseeker">{t("typeJobseeker")}</option>
                      <option value="employer">{t("typeEmployer")}</option>
                      <option value="other">{t("typeOther")}</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="mb-2 text-[12px] font-black tracking-wider"
                    >
                      {t("messageLabel")}
                      <span className="text-red-500"> *</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder={t("messagePlaceholder")}
                    />
                  </div>

                  <div className="rounded bg-santo-gray p-3 sm:p-5">
                    <label className="flex items-start gap-3 text-[13px] text-slate-600">
                      <input
                        type="checkbox"
                        name="privacyConsent"
                        required
                        className="mt-1 rounded border-slate-300"
                      />
                      <span>
                        <Link href={`/${locale}/privacy`} className="font-bold text-santo-blue underline">
                          {t("privacyLink")}
                        </Link>
                        {t("privacyConsent")}
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full bg-santo-navy px-6 font-black tracking-wider hover:bg-santo-blue"
                  >
                    <Mail className="h-4 w-4" />
                    {t("submitButton")}
                  </Button>
                  <p className="text-[12px] leading-[1.8] text-slate-500">
                    {t("submitHint")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
