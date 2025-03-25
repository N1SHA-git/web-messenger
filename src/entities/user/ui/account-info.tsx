export function AccountInfo({
  created_at,
}: {
  created_at: string | undefined;
}) {
  return (
    <div className="mt-6 bg-base-300 rounded-xl p-6">
      <h2 className="text-lg font-medium  mb-4">Account Information</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-zinc-700">
          <span>Member Since</span>
          <span>{created_at}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span>Account Status</span>
          <span className="text-green-500">Active</span>
        </div>
      </div>
    </div>
  );
}
