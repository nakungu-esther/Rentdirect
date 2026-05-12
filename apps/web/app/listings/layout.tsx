import { PublicChrome } from "@/components/PublicChrome";

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicChrome>{children}</PublicChrome>;
}
