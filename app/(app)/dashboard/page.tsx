import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { listProjects, listTemplates } from "@/services/project-service";

export default async function DashboardPage() {
  const [projects, templates] = await Promise.all([
    listProjects(),
    listTemplates(),
  ]);
  
  return <DashboardScreen projects={projects} templates={templates} />;
}
