import Link from 'next/link';

const Nav = () => (
  <div>
    <Link href="/">
      <a>home</a>
    </Link>
    <Link href="/search">
      <a>search</a>
    </Link>
    <Link href="/create">
      <a>create</a>
    </Link>
    <Link href="/profile">
      <a>profile</a>
    </Link>
  </div>
);

export default Nav;
