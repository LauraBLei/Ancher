import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex w-full justify-between">
      <div>Logo</div>
      <nav>
        <Link href={"/login"}>Login</Link>
      </nav>
    </header>
  );
};
