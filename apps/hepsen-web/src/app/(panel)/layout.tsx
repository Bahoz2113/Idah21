import { PanelNav } from "@/components/nav/panel-nav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <PanelNav />
      <main className="flex-1 p-4 pb-20 md:pb-4">{children}</main>
    </div>
  );
}
