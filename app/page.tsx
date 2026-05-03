import { LandingPage } from "@/components/landing/landing-page";
import { listTemplates } from "@/services/project-service";

export default async function Home() {
  const templates = await listTemplates();
  return <LandingPage templates={templates} />;
}
