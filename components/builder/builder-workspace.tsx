"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PreviewIcon } from "@/components/ui/preview-icon";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/editor/code-editor";
import { agentSteps, chatMessages, files, projects } from "@/lib/preview-data";
import { cn } from "@/lib/utils";

const previewModes = ["Desktop", "Tablet", "Mobile"] as const;
type ChatMessage = { role: string; content: string };

export function BuilderWorkspace() {
  const [selectedFile, setSelectedFile] = React.useState(files[0]);
  const [mode, setMode] = React.useState<(typeof previewModes)[number]>("Desktop");
  const [prompt, setPrompt] = React.useState("Make the hero more premium and add a pricing section.");
  const [messages, setMessages] = React.useState<ChatMessage[]>(chatMessages);
  const [isGenerating, setIsGenerating] = React.useState(false);

  function appendAssistant(delta: string) {
    setMessages((current) => {
      const next = [...current];
      const last = next[next.length - 1];
      if (last?.role === "assistant") {
        next[next.length - 1] = { ...last, content: `${last.content}${delta}` };
      }
      return next;
    });
  }

  async function runPreviewGeneration() {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setPrompt("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          projectName: "Northstar SaaS",
          files: files.map((file) => ({ path: file.path, content: file.content })),
        }),
      });

      if (!response.ok || !response.body) {
        appendAssistant("The generation request failed. Check server logs and API keys.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;

          try {
            const event = JSON.parse(payload) as {
              type?: string;
              delta?: string;
              files?: typeof files;
              error?: string;
            };

            if (event.type === "response.output_text.delta" && event.delta) {
              appendAssistant(event.delta);
            }

            if (event.type === "delta" && event.delta) {
              appendAssistant(event.delta);
            }

            if (event.type === "files" && event.files?.[0]) {
              setSelectedFile(event.files[0]);
            }

            if (event.type === "error" && event.error) {
              appendAssistant(event.error);
            }
          } catch {
            appendAssistant(payload);
          }
        }
      }
    } catch (error) {
      appendAssistant(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  const previewWidth =
    mode === "Desktop" ? "w-full" : mode === "Tablet" ? "max-w-[720px]" : "max-w-[390px]";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-col gap-4 border-b bg-background/72 p-4 backdrop-blur-xl xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Back
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold">Northstar SaaS</h1>
              <Badge variant="success">Autosaved</Badge>
              <Badge variant="outline">v17</Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              AI website builder workspace with chat, code, history, preview, sync, and deploy.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Fork</Button>
          <Button variant="outline" size="sm" onClick={() => window.open("/api/projects/northstar/export", "_blank")}>
            Export ZIP
          </Button>
          <Button variant="outline" size="sm">Push GitHub</Button>
          <Button size="sm">Deploy</Button>
        </div>
      </div>

      <div className="grid flex-1 overflow-hidden xl:grid-cols-[340px_minmax(420px,0.88fr)_minmax(520px,1.12fr)]">
        <aside className="flex min-h-[520px] flex-col border-b bg-background/65 xl:border-b-0 xl:border-r">
          <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col">
            <div className="border-b p-3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="m-0 flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={cn(
                        "rounded-lg border p-3 text-sm leading-6",
                        message.role === "user"
                          ? "ml-8 bg-primary text-primary-foreground"
                          : "mr-6 bg-card",
                      )}
                    >
                      {message.content}
                    </div>
                  ))}
                  {isGenerating && messages[messages.length - 1]?.content.length === 0 && (
                    <div className="mr-8 rounded-lg border bg-card p-3">
                      <div className="h-3 w-36 animate-pulse rounded-md bg-muted" />
                      <div className="mt-3 h-3 w-48 animate-pulse rounded-md bg-muted" />
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t p-3">
                <Textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="min-h-24"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Streaming UI preview</span>
                  <Button size="sm" onClick={runPreviewGeneration} disabled={isGenerating}>
                    {isGenerating ? "Generating" : "Send"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="m-0 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {agentSteps.map((step) => (
                  <Card key={step.name} className="bg-card/70">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <PreviewIcon name={step.name} />
                          <div>
                            <div className="text-sm font-medium">{step.name}</div>
                            <div className="text-xs text-muted-foreground">{step.detail}</div>
                          </div>
                        </div>
                        <Badge variant={step.status === "Complete" ? "success" : step.status === "Running" ? "warning" : "secondary"}>
                          {step.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="m-0 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {["v17 Added responsive pricing", "v16 Refined hero", "v15 Synced GitHub branch", "v14 Initial template fork"].map((item, index) => (
                  <button key={item} type="button" className="rounded-md border bg-card/70 p-3 text-left transition hover:bg-card">
                    <div className="text-sm font-medium">{item}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{index + 1} snapshot{index === 0 ? "" : "s"} ago</div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        <section className="flex min-h-[560px] min-w-0 flex-col border-b bg-[#111512] text-[#eaf2ed] xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div className="text-sm font-medium">Files</div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-[#eaf2ed] hover:bg-white/10">New</Button>
              <Button variant="ghost" size="sm" className="text-[#eaf2ed] hover:bg-white/10">Save</Button>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 md:grid-cols-[220px_1fr]">
            <div className="border-b border-white/10 bg-white/[0.03] p-2 md:border-b-0 md:border-r">
              {files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[#aebbb4] transition hover:bg-white/10 hover:text-white",
                    selectedFile.path === file.path && "bg-white/10 text-white",
                  )}
                >
                  <PreviewIcon name={file.language} className="border-white/10 bg-white/10 text-[#cfe4d8]" />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="truncate text-xs text-[#aebbb4]">{selectedFile.path}</span>
                <Badge variant="outline" className="border-white/15 text-[#cfe4d8]">{selectedFile.language}</Badge>
              </div>
              <CodeEditor
                path={selectedFile.path}
                language={selectedFile.language}
                content={selectedFile.content}
              />
            </div>
          </div>
        </section>

        <section className="flex min-h-[680px] min-w-0 flex-col bg-background/70">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
            <div>
              <div className="text-sm font-medium">Live preview</div>
              <div className="text-xs text-muted-foreground">Hot-reload surface with responsive modes</div>
            </div>
            <div className="flex items-center rounded-md bg-secondary p-1">
              {previewModes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-xs font-medium text-muted-foreground transition",
                    mode === item && "bg-background text-foreground shadow-sm",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className={cn("mx-auto min-h-[620px] transition-all", previewWidth)}>
              <PreviewSite compact={mode !== "Desktop"} />
            </div>
          </div>

          <div className="grid gap-0 border-t md:grid-cols-3">
            {[
              ["GitHub", "main synced 2m ago"],
              ["Vercel", "preview queued"],
              ["Share", "private link active"],
            ].map(([title, detail]) => (
              <div key={title} className="border-b p-3 md:border-b-0 md:border-r last:border-r-0">
                <div className="text-sm font-medium">{title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewSite({ compact }: { compact: boolean }) {
  const project = projects[0];

  return (
    <div className="overflow-hidden rounded-lg border bg-[#fbfcf8] text-[#101512] shadow-2xl dark:bg-[#121713] dark:text-[#eef5ef]">
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
        <strong>Northstar</strong>
        <div className="hidden items-center gap-5 text-xs text-[#607068] sm:flex">
          <span>Product</span>
          <span>Pricing</span>
          <span>Docs</span>
        </div>
        <button className="rounded-md bg-[#0f5f59] px-3 py-2 text-xs font-medium text-white">
          Start free
        </button>
      </div>
      <div className={cn("grid gap-8 p-6 md:p-10", compact ? "grid-cols-1" : "lg:grid-cols-[0.92fr_1.08fr]")}>
        <div className="flex flex-col justify-center">
          <h2 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
            Resolve customer work before it becomes a queue.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f6f67] dark:text-[#a8b8af]">
            Northstar routes support work through AI agents, human approvals, and observability built for fast teams.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="rounded-md bg-[#0f5f59] px-4 py-2 text-sm font-medium text-white">Launch workflow</button>
            <button className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10">See demo</button>
          </div>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-white/5">
          <div className={`h-32 rounded-md bg-gradient-to-br ${project.accent}`} />
          <div className="mt-4 grid gap-3">
            {["AI triage", "Human approval", "Deployment notes"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-black/10 p-3 dark:border-white/10">
                <span className="text-sm font-medium">{item}</span>
                <span className="text-xs text-[#607068]">{index === 0 ? "Live" : "Ready"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid gap-3 p-6 md:grid-cols-3 md:p-10">
        {["Starter", "Scale", "Enterprise"].map((plan, index) => (
          <div key={plan} className="rounded-md border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold">{plan}</div>
            <div className="mt-3 text-3xl font-semibold">${[19, 79, 199][index]}</div>
            <p className="mt-2 text-xs leading-5 text-[#607068] dark:text-[#a8b8af]">
              Includes AI edits, version history, preview links, and deploy workflows.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
