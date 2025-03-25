import Link from "next/link";

export function NavLink({
  route,
  text,
  icon,
}: {
  route: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={route} className="btn btn-sm gap-2 transition-colors">
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </Link>
  );
}
