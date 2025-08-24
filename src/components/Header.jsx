"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import hamburgerIcon from "../../public/assets/icons/hamburger.png";
import closeIcon from "../../public/assets/icons/close.png";
import "./Header.scss";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
    fetchAuthStatus();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="blogger-header">
      <div className="blogger-header-container">
        <Link href={isLoggedIn ? "/home" : "/blog"} className="logo">
          Blog App
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          <Image src={menuOpen ? closeIcon : hamburgerIcon} alt="menu" width={24} height={24} />
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link href="/home" className="nav-item" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/posts/create" className="nav-item" onClick={() => setMenuOpen(false)}>
                Create Post
              </Link>
              <Link href="/profile" className="nav-item" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-item logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/blog" className="nav-item" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/login" className="nav-item" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="nav-item" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
