"use client";

import { useRouter } from "next/navigation";
import LoginForm from "./auth/LoginForm";
import { supabase } from "./Utils/Supabase/client";
import { useEffect, useState } from "react";
import { set } from "date-fns";

export default function Page() {
  const router = useRouter();
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session data:", session);
      if (!session) {
        router.push("/auth");
      } else {
        setPageLoad(true);    
        router.push("/form");
      }
    };
    checkAuth();
  }, [router, supabase]);

  if (!pageLoad) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <p>Loading...</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    );
  }
}
