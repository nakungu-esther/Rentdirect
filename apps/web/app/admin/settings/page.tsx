"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Control plane defaults for RentDirect UG. Persist to your configuration service or secrets manager."
        actions={<Button>Save changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Public-facing labels and support contacts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Support email
              </label>
              <Input defaultValue="support@rentdirect.ug" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Operations phone
              </label>
              <Input defaultValue="+256 700 000000" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API & limits</CardTitle>
            <CardDescription>Gateway throttles and webhook targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Webhook signing secret
              </label>
              <Input type="password" placeholder="••••••••••••" autoComplete="off" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Rate limit (req / min / tenant)
              </label>
              <Input defaultValue="1200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
          <CardDescription>Progressive delivery toggles — connect to your flag provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { key: "payments.momo.secondary", label: "Secondary MoMo routing", on: true },
              { key: "contracts.ai_clause_review", label: "AI clause review (beta)", on: false },
              { key: "listings.video.walkthrough", label: "Video walkthrough uploads", on: true },
            ] as const
          ).map((f, idx, arr) => (
            <div key={f.key}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{f.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{f.key}</p>
                </div>
                <Button variant={f.on ? "default" : "secondary"} size="sm" type="button">
                  {f.on ? "Enabled" : "Disabled"}
                </Button>
              </div>
              {idx < arr.length - 1 ? <Separator className="mt-4" /> : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
