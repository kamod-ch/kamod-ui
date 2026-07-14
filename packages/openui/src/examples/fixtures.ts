/**
 * Static OpenUI Lang fixtures for demos and tests.
 * Positional args follow Zod key order in component definitions.
 */

export const STATUS_CARD_LANG = `root = Stack([card], "md")
card = Card([badge, heading, text, progress, actions], "Deployment", "Production rollout")
badge = Badge("Healthy", "success")
heading = Heading("All systems go", "3")
text = Text("Latency is within budget and error rate is low.", "muted")
progress = Progress(82)
actions = Inline([refreshBtn], "sm")
refreshBtn = Button("Refresh", "outline", "sm", false, { type: "event", name: "refresh" })`;

export const CONTACT_FORM_LANG = `root = Form("contact", [nameField, emailField, messageField, consentField, submit])
nameField = Input("name", "Name", "text", "Jane Doe")
emailField = Input("email", "Email", "email", "jane@example.com")
messageField = Textarea("message", "Message", "How can we help?")
consentField = Checkbox("consent", "I agree to be contacted")
submit = SubmitButton("Send message")`;

export const SETTINGS_UI_LANG = `root = Tabs([
  { id: "general", label: "General", content: [alert, darkSwitch, saveBtn] },
  { id: "notifications", label: "Notifications", content: [emailSwitch, note] }
], "general")
alert = Alert("Workspace settings", "Changes apply to all members.", "info")
darkSwitch = Switch("darkMode", "Dark mode")
saveBtn = Button("Save", "default", "md", false, { type: "event", name: "save_settings" })
emailSwitch = Switch("emailAlerts", "Email alerts")
note = Text("You can change these preferences anytime.", "muted")`;

export const SIMPLE_CARD_LANG = `root = Card([heading, text], "Hello", "A simple card")
heading = Heading("Welcome", "2")
text = Text("Generated with @kamod-ch/openui.")`;
