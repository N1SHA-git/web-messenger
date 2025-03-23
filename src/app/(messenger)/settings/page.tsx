import { Theme, PreviewSection } from "@/features/theme";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <Theme />

        <PreviewSection />
      </div>
    </div>
  );
}
