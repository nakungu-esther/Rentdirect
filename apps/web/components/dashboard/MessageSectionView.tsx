import { notFound } from "next/navigation";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { MESSAGE_SECTION_SLUGS, MESSAGES_HUB_LINKS } from "@/components/dashboard/hub-links";

export function MessageSectionView({ section }: { section: string }) {
  if (!(MESSAGE_SECTION_SLUGS as readonly string[]).includes(section)) {
    notFound();
  }
  const label = MESSAGES_HUB_LINKS.find((l) => l.suffix === `/${section}`)?.label ?? section;
  return (
    <ModulePlaceholder
      title={label}
      description="Conversation threads, read receipts, and attachments will sync here from the messaging service."
    />
  );
}
