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

export const EMPTY_STATE_LANG = `root = Stack([empty, tip, avatar], "md")
empty = Empty("No results", "Try adjusting filters.", "Reset", { type: "event", name: "reset" })
tip = Tooltip("What's this?", "Empty states appear when a list has zero items.")
avatar = Avatar("JD")`;

export const DASHBOARD_LANG = `root = Stack([header, kpiGrid, chart, table], "md")
header = Inline([title, refreshBtn], "sm")
title = Heading("Sales overview", "2")
refreshBtn = Button("Refresh", "outline", "sm", false, { type: "event", name: "refresh" })
kpiGrid = Grid([kpiRevenue, kpiUsers, kpiConversion, kpiChurn], 4, "md")
kpiRevenue = Card([revBadge, revValue, revHint], "Revenue")
revBadge = Badge("Healthy", "success")
revValue = Heading("$128k", "3")
revHint = Text("vs last month +12%", "muted")
kpiUsers = Card([usersBadge, usersValue, usersHint], "Active users")
usersBadge = Badge("Growing", "info")
usersValue = Heading("4,812", "3")
usersHint = Text("Weekly active accounts", "muted")
kpiConversion = Card([convBadge, convValue, convHint], "Conversion")
convBadge = Badge("Watch", "warning")
convValue = Heading("3.4%", "3")
convHint = Text("Checkout completion rate", "muted")
kpiChurn = Card([churnBadge, churnValue, churnHint], "Churn")
churnBadge = Badge("Stable", "neutral")
churnValue = Heading("1.1%", "3")
churnHint = Text("Monthly cancellations", "muted")
chart = Chart("Revenue trend", "Last four weeks", [
  { label: "Week 1", value: 28 },
  { label: "Week 2", value: 36 },
  { label: "Week 3", value: 31 },
  { label: "Week 4", value: 44 }
])
table = DataTable([
  { id: "customer", header: "Customer" },
  { id: "plan", header: "Plan" },
  { id: "mrr", header: "MRR" },
  { id: "status", header: "Status" }
], [
  ["Acme Corp", "Pro", "$890", "Active"],
  ["Bright Labs", "Starter", "$49", "Trial"],
  ["Northwind", "Enterprise", "$4,200", "Active"]
], "Top accounts")`;

/** Demo fallbacks keyed by quick-prompt id for the dashboard generator. */
export const DASHBOARD_DEMO_FIXTURES = {
  "kpi-overview": DASHBOARD_LANG,
  analytics: `root = Stack([heading, chart, alert], "md")
heading = Heading("Analytics dashboard", "2")
chart = Chart("Traffic sources", "Sessions this week", [
  { label: "Organic", value: 420 },
  { label: "Direct", value: 210 },
  { label: "Referral", value: 96 },
  { label: "Paid", value: 180 }
])
alert = Alert("Insight", "Organic search leads session volume this week.", "info")`,
  "team-status": `root = Stack([heading, kpiGrid, table], "md")
heading = Heading("Team status", "2")
kpiGrid = Grid([openCard, doneCard, blockedCard], 3, "md")
openCard = Card([openBadge, openValue], "Open")
openBadge = Badge("In progress", "info")
openValue = Heading("18", "3")
doneCard = Card([doneBadge, doneValue], "Done")
doneBadge = Badge("Shipped", "success")
doneValue = Heading("42", "3")
blockedCard = Card([blockedBadge, blockedValue], "Blocked")
blockedBadge = Badge("Needs help", "danger")
blockedValue = Heading("3", "3")
table = DataTable([
  { id: "owner", header: "Owner" },
  { id: "task", header: "Task" },
  { id: "status", header: "Status" }
], [
  ["Alex", "Billing migration", "In progress"],
  ["Sam", "Dashboard charts", "Done"],
  ["Jordan", "Auth MFA", "Blocked"]
], "Current work")`,
} as const;

export type DashboardDemoFixtureKey = keyof typeof DASHBOARD_DEMO_FIXTURES;
