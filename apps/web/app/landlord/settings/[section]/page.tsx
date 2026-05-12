import { SETTINGS_SECTION_SLUGS } from "@/components/dashboard/hub-links";
import { SettingsSectionView } from "@/components/dashboard/SettingsSectionView";

export function generateStaticParams() {
  return SETTINGS_SECTION_SLUGS.map((section) => ({ section }));
}

export default async function LandlordSettingsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <SettingsSectionView section={section} />;
}
