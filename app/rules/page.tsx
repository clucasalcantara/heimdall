import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { RuleEngine } from "@/components/rule-engine";

export default function RulesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Rule Engine"
        subheading="Create and manage fraud detection rules"
      />
      <RuleEngine />
    </DashboardShell>
  );
}
