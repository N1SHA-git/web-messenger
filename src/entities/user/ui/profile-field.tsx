export function ProfileField({
  label,
  placeHolder,
  icon,
}: {
  label: string;
  placeHolder: string | undefined;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-zinc-400 flex items-center gap-2">
        {icon}
        {label}
      </div>

      <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-white/80">
        {placeHolder}
      </p>
    </div>
  );
}
