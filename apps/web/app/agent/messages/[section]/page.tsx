import { MESSAGE_SECTION_SLUGS } from "@/components/dashboard/hub-links";
import { MessageSectionView } from "@/components/dashboard/MessageSectionView";

export function generateStaticParams() {
  return MESSAGE_SECTION_SLUGS.map((section) => ({ section }));
}

export default async function AgentMessageSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <MessageSectionView section={section} />;
}
