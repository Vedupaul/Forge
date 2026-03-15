import Link from "next/link";
import { signIn } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function signInWithGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

async function signInWithGitHub() {
  "use server";
  await signIn("github", { redirectTo: "/dashboard" });
}

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <div className="pointer-events-none fixed inset-0 grid-background opacity-80" />
      <Card className="glass-panel relative w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to Forge</CardTitle>
          <CardDescription>Continue with Google or GitHub to persist projects and sync repositories.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action={signInWithGoogle}>
            <button className="h-11 w-full rounded-md border bg-background/70 text-sm font-medium" type="submit">
              Continue with Google
            </button>
          </form>
          <form action={signInWithGitHub}>
            <button className="h-11 w-full rounded-md border bg-background/70 text-sm font-medium" type="submit">
              Continue with GitHub
            </button>
          </form>
          <Link href="/dashboard" className={buttonVariants({ className: "mt-2" })}>Preview dashboard</Link>
        </CardContent>
      </Card>
    </main>
  );
}
