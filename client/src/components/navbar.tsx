import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";

export default function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/me"],
    retry: false
  });

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/">
          <a className="mr-8 flex items-center space-x-2">
            <span className="text-xl font-bold">ElektriVahetus</span>
          </a>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link href="/">
            <a className={location === "/" ? "font-bold" : ""}>{t("nav.home")}</a>
          </Link>
          
          {user && (
            <>
              <Link href="/dashboard">
                <a className={location === "/dashboard" ? "font-bold" : ""}>
                  {t("nav.dashboard")}
                </a>
              </Link>
              <Link href="/profile">
                <a className={location === "/profile" ? "font-bold" : ""}>
                  {t("nav.profile")}
                </a>
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto">
          {!user && (
            <Link href="/auth">
              <Button>{t("login")}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
