const importLine = `import { Field as FormischField, FieldArray, Form as FormischForm, insert, remove, reset, useForm } from "@formisch/preact";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input, RadioGroup, RadioGroupItem, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@kamod-ch/ui";
import * as v from "valibot";`;

export const bugReportSnippet = `${importLine}

const Schema = v.object({
  title: v.pipe(v.string(), v.minLength(5), v.maxLength(32)),
  description: v.pipe(v.string(), v.minLength(20), v.maxLength(100)),
});

export function BugReportForm() {
  const form = useForm({ schema: Schema, initialInput: { title: "", description: "" }, validate: "submit", revalidate: "input" });
  return <FormischForm of={form} onSubmit={(data) => console.log(data)} class="grid gap-5">
    <FormischField of={form} path={["title"]}>{(field) => <Field invalid={!!field.errors?.length}>
      <FieldLabel htmlFor="bug-title">Bug Title</FieldLabel>
      <Input {...field.props} id="bug-title" value={typeof field.input === "string" ? field.input : ""} aria-invalid={!!field.errors?.length} />
      <FieldDescription>5–32 characters.</FieldDescription>
      <FieldError errors={field.errors?.map((message) => ({ message }))} />
    </Field>}</FormischField>
    <FormischField of={form} path={["description"]}>{(field) => <Field invalid={!!field.errors?.length}>
      <FieldLabel htmlFor="bug-description">Description</FieldLabel>
      <Textarea {...field.props} id="bug-description" value={typeof field.input === "string" ? field.input : ""} aria-invalid={!!field.errors?.length} />
      <FieldError errors={field.errors?.map((message) => ({ message }))} />
    </Field>}</FormischField>
    <Button type="button" variant="outline" onClick={() => reset(form)}>Reset</Button>
    <Button type="submit">Submit</Button>
  </FormischForm>;
}`;

export const inputSnippet = `${importLine}

const Schema = v.object({ username: v.pipe(v.string(), v.regex(/^[a-z0-9_-]+$/), v.minLength(3), v.maxLength(20)) });
export function ProfileSettingsForm() { const form = useForm({ schema: Schema, initialInput: { username: "kamod_user" }, validate: "blur", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["username"]}>{(field) => <Field invalid={!!field.errors?.length}><FieldLabel htmlFor="username">Username</FieldLabel><Input {...field.props} id="username" value={typeof field.input === "string" ? field.input : ""} aria-invalid={!!field.errors?.length} /><FieldDescription>Lowercase letters, numbers, underscores and dashes.</FieldDescription><FieldError errors={field.errors?.map((message) => ({ message }))} /></Field>}</FormischField><Button type="button" onClick={() => reset(form)}>Reset</Button><Button type="submit">Save</Button></FormischForm>; }`;
export const textareaSnippet = `${importLine}

const Schema = v.object({ about: v.pipe(v.string(), v.minLength(24), v.maxLength(160)) });
export function PersonalizationForm() { const form = useForm({ schema: Schema, initialInput: { about: "" }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["about"]}>{(field) => <Field invalid={!!field.errors?.length}><FieldLabel htmlFor="about">More about you</FieldLabel><Textarea {...field.props} id="about" value={typeof field.input === "string" ? field.input : ""} aria-invalid={!!field.errors?.length} /><FieldError errors={field.errors?.map((message) => ({ message }))} /></Field>}</FormischField><Button type="submit">Save</Button></FormischForm>; }`;
export const selectSnippet = `${importLine}

const Schema = v.object({ language: v.picklist(["en", "de", "fr", "it", "rm"]) });
export function LanguagePreferencesForm() { const form = useForm({ schema: Schema, initialInput: { language: "" }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["language"]}>{(field) => <Field invalid={!!field.errors?.length}><FieldLabel id="language-label">Spoken Language</FieldLabel><Select value={typeof field.input === "string" ? field.input : ""} onValueChange={field.onChange}><SelectTrigger aria-labelledby="language-label" aria-invalid={!!field.errors?.length}><SelectValue placeholder="Select a language" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="en">English</SelectItem><SelectItem value="de">German</SelectItem></SelectGroup></SelectContent></Select><FieldError errors={field.errors?.map((message) => ({ message }))} /></Field>}</FormischField><Button type="submit">Save</Button></FormischForm>; }`;
export const checkboxSnippet = `${importLine}

const Schema = v.object({ channels: v.pipe(v.array(v.picklist(["product", "security", "billing"])), v.minLength(1)) });
export function NotificationPreferencesForm() { const form = useForm({ schema: Schema, initialInput: { channels: ["security"] }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["channels"]}>{(field) => { const selected = Array.isArray(field.input) ? field.input : []; return <FieldSet><FieldLegend>Notification channels</FieldLegend>{["product", "security", "billing"].map((channel) => <Field orientation="horizontal" key={channel}><Checkbox id={channel} checked={selected.includes(channel)} onCheckedChange={(checked) => field.onChange(checked === true ? [...selected, channel] : selected.filter((item) => item !== channel))} /><FieldLabel htmlFor={channel}>{channel}</FieldLabel></Field>)}<FieldError errors={field.errors?.map((message) => ({ message }))} /></FieldSet>; }}</FormischField><Button type="submit">Save</Button></FormischForm>; }`;
export const radioSnippet = `${importLine}

const Schema = v.object({ plan: v.picklist(["starter", "pro", "enterprise"]) });
export function SubscriptionPlanForm() { const form = useForm({ schema: Schema, initialInput: { plan: "" }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["plan"]}>{(field) => <RadioGroup value={typeof field.input === "string" ? field.input : ""} onValueChange={field.onChange}><RadioGroupItem value="starter">Starter</RadioGroupItem><RadioGroupItem value="pro">Pro</RadioGroupItem><RadioGroupItem value="enterprise">Enterprise</RadioGroupItem></RadioGroup>}</FormischField><Button type="submit">Save</Button></FormischForm>; }`;
export const switchSnippet = `${importLine}

const Schema = v.object({ mfa: v.boolean() });
export function SecuritySettingsForm() { const form = useForm({ schema: Schema, initialInput: { mfa: false }, validate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["mfa"]}>{(field) => <Field orientation="horizontal"><Switch id="mfa" checked={field.input === true} onCheckedChange={field.onChange} /><FieldLabel htmlFor="mfa">Multi-factor authentication</FieldLabel></Field>}</FormischField><Button type="submit">Save</Button></FormischForm>; }`;
export const complexSnippet = `${importLine}

const Schema = v.object({ plan: v.picklist(["starter", "pro", "enterprise"]), billing: v.picklist(["monthly", "yearly"]), addons: v.array(v.picklist(["analytics", "support", "audit"])), email: v.boolean() });
export function SubscriptionPreferencesForm() { const form = useForm({ schema: Schema, initialInput: { plan: "pro", billing: "yearly", addons: ["analytics"], email: true }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FormischField of={form} path={["plan"]}>{(field) => <RadioGroup value={typeof field.input === "string" ? field.input : ""} onValueChange={field.onChange}><RadioGroupItem value="starter">Starter</RadioGroupItem><RadioGroupItem value="pro">Pro</RadioGroupItem><RadioGroupItem value="enterprise">Enterprise</RadioGroupItem></RadioGroup>}</FormischField><Button type="button" onClick={() => reset(form)}>Reset</Button><Button type="submit">Save Preferences</Button></FormischForm>; }`;
export const arraySnippet = `${importLine}

const Schema = v.object({ emails: v.pipe(v.array(v.pipe(v.string(), v.email())), v.minLength(1), v.maxLength(5)) });
export function ContactEmailsForm() { const form = useForm({ schema: Schema, initialInput: { emails: ["hello@kamod.ch"] }, validate: "submit", revalidate: "input" }); return <FormischForm of={form} onSubmit={console.log}><FieldArray of={form} path={["emails"]}>{(array) => <FieldSet><FieldLegend>Contact Emails</FieldLegend>{array.items.map((itemId, index) => <FormischField key={itemId} of={form} path={["emails", index]}>{(field) => <Field invalid={!!field.errors?.length}><FieldLabel htmlFor={itemId}>Email {index + 1}</FieldLabel><Input {...field.props} id={itemId} value={typeof field.input === "string" ? field.input : ""} /><Button type="button" aria-label={"Remove email " + (index + 1)} onClick={() => remove(form, { path: ["emails"], at: index })}>Remove</Button><FieldError errors={field.errors?.map((message) => ({ message }))} /></Field>}</FormischField>)}<Button type="button" disabled={array.items.length >= 5} onClick={() => insert(form, { path: ["emails"], at: array.items.length, initialInput: "" })}>Add email</Button></FieldSet>}</FieldArray><Button type="submit">Save</Button></FormischForm>; }`;
export const methodsSnippet = `${importLine}
import { focus, getErrors, getInput, move, replace, setErrors, setInput, submit, swap, validate } from "@formisch/preact";

const form = useForm({ schema, initialInput, validate: "submit", revalidate: "input" });
getInput(form, { path: ["email"] });
setInput(form, { path: ["email"], input: "hello@kamod.ch" });
getErrors(form, { path: ["email"] });
setErrors(form, { path: ["email"], errors: ["Use a work email."] });
await validate(form, { shouldFocus: true });
submit(form);
focus(form, { path: ["email"] });
insert(form, { path: ["emails"], at: 0, initialInput: "" });
remove(form, { path: ["emails"], at: 0 });
move(form, { path: ["emails"], from: 0, to: 1 });
swap(form, { path: ["emails"], at: 0, and: 1 });
replace(form, { path: ["emails"], at: 0, initialInput: "team@kamod.ch" });
reset(form);`;
export const validationModesSnippet = `const submitOnly = useForm({ schema, validate: "submit" });
const blurFirst = useForm({ schema, validate: "blur", revalidate: "input" });
const live = useForm({ schema, validate: "input" });
const validateImmediately = useForm({ schema, validate: "initial" });
const revalidateOnBlur = useForm({ schema, validate: "submit", revalidate: "blur" });
const revalidateOnSubmit = useForm({ schema, validate: "blur", revalidate: "submit" });`;
