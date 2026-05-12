import { redirect } from "next/navigation";

export default function TenantSettingsIndexPage() {
  redirect("/tenant/settings/profile");
}
