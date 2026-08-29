import { CircleCheckIcon, SendIcon } from "@kamod-ch/icons/lucide";
import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldError,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@kamod-ch/ui";
import { useRef, useState } from "preact/hooks";

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export type ContactSubjectOption = {
  value: string;
  label: string;
};

export type ContactFormCopy = {
  title?: string;
  description?: string;
  nameLabel?: string;
  emailLabel?: string;
  companyLabel?: string;
  subjectLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  pendingLabel?: string;
  successTitle?: string;
  successDescription?: (payload: ContactPayload) => string;
  anotherLabel?: string;
};

export type ContactFormProps = {
  idPrefix: string;
  subjects?: ContactSubjectOption[];
  copy?: ContactFormCopy;
  onSubmit?: (payload: ContactPayload) => void | Promise<void>;
};

const defaultSubjects: ContactSubjectOption[] = [
  { value: "sales", label: "Talking to sales" },
  { value: "support", label: "Customer support" },
  { value: "partnership", label: "Partnerships" },
  { value: "other", label: "Something else" },
];

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const ContactForm = ({
  idPrefix,
  subjects = defaultSubjects,
  copy = {},
  onSubmit,
}: ContactFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState(subjects[0]?.value ?? "sales");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState<ContactPayload | null>(null);

  const title = copy.title ?? "Send us a message";
  const description = copy.description ?? "We reply during business hours.";
  const subjectLabel = subjects.find((item) => item.value === subject)?.label ?? subject;

  const validate = () => {
    const next: Partial<Record<keyof ContactPayload, string>> = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!isEmail(email)) next.email = "Enter a valid email address.";
    if (!message.trim()) next.message = "Enter a message.";
    return next;
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
    setSubmitted(null);
    setErrors({});
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setErrorMessage("");
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const payload: ContactPayload = { name, email, company, subject, message };
    setStatus("pending");
    try {
      await onSubmit?.(payload);
      setSubmitted(payload);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success" && submitted) {
    return (
      <CardContent class="space-y-4 pt-8 text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-success/20 text-success">
          <CircleCheckIcon size={24} />
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-semibold">{copy.successTitle ?? "Message sent"}</h3>
          <p class="text-sm text-muted-foreground" role="status" aria-live="polite">
            {copy.successDescription?.(submitted) ??
              `Thanks ${submitted.name}, we'll be in touch within a few hours.`}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={reset}>
          {copy.anotherLabel ?? "Send another"}
        </Button>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} class="grid gap-4" onSubmit={submit} noValidate>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <Label for={`${idPrefix}-name`}>{copy.nameLabel ?? "Name"}</Label>
              <Input
                id={`${idPrefix}-name`}
                name="name"
                value={name}
                required
                disabled={status === "pending"}
                aria-invalid={errors.name ? "true" : undefined}
                onInput={(event) => setName(event.currentTarget.value)}
              />
              <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
            </div>
            <div class="grid gap-2">
              <Label for={`${idPrefix}-email`}>{copy.emailLabel ?? "Work email"}</Label>
              <Input
                id={`${idPrefix}-email`}
                name="email"
                type="email"
                value={email}
                required
                disabled={status === "pending"}
                autocomplete="email"
                aria-invalid={errors.email ? "true" : undefined}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
              <FieldError errors={errors.email ? [{ message: errors.email }] : []} />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for={`${idPrefix}-company`}>{copy.companyLabel ?? "Company"}</Label>
            <Input
              id={`${idPrefix}-company`}
              name="company"
              value={company}
              disabled={status === "pending"}
              onInput={(event) => setCompany(event.currentTarget.value)}
            />
          </div>
          <div class="grid gap-2">
            <Label for={`${idPrefix}-subject`}>{copy.subjectLabel ?? "I'm interested in"}</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id={`${idPrefix}-subject`}>
                <SelectValue>{subjectLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {subjects.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for={`${idPrefix}-message`}>{copy.messageLabel ?? "Message"}</Label>
            <Textarea
              id={`${idPrefix}-message`}
              name="message"
              value={message}
              required
              disabled={status === "pending"}
              placeholder={copy.messagePlaceholder ?? "How can we help?"}
              aria-invalid={errors.message ? "true" : undefined}
              onInput={(event) => setMessage(event.currentTarget.value)}
            />
            <FieldError errors={errors.message ? [{ message: errors.message }] : []} />
          </div>
          {status === "error" ? (
            <p class="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button type="submit" class="w-full" disabled={status === "pending"}>
            {status === "pending"
              ? (copy.pendingLabel ?? "Sending…")
              : (copy.submitLabel ?? "Send message")}
            {status === "pending" ? null : <SendIcon size={16} />}
          </Button>
        </form>
      </CardContent>
    </>
  );
};
