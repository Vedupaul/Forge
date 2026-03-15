import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const settings = [
  ["Google OAuth", "Ready for client ID and secret"],
  ["GitHub OAuth", "Repo scopes, sync, branches, and imports"],
  ["OpenAI", "Streaming generation model and usage limits"],
  ["Vercel", "Deployments, environment variables, live URLs"],
  ["Storage", "UploadThing or Supabase Storage for assets"],
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="glass-panel rounded-lg p-6 md:p-8">
        <Badge variant="secondary">Settings</Badge>
        <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Connect the services behind the studio.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          The frontend is ready for credentials, provider status, rate limits, and environment management.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Backend phase will bind these panels to real OAuth and provider APIs.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {settings.map(([name, description]) => (
              <div key={name} className="flex items-center justify-between gap-4 rounded-md border bg-background/60 p-4">
                <div>
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Environment variables</CardTitle>
            <CardDescription>Project-level secrets with deployment sync.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {["OPENAI_API_KEY", "DATABASE_URL", "AUTH_SECRET"].map((key) => (
              <div key={key} className="grid gap-2">
                <label className="text-xs font-medium text-muted-foreground">{key}</label>
                <Input value="••••••••••••••••" readOnly />
              </div>
            ))}
            <Separator />
            <Button>Add secret</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
