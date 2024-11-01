"use client";

import { getUser } from "@/services/lifeline-angel/user";
import { useUserStore } from "@/stores/lifeline-angel/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function Containers({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { user: userLocal, setUser: setUserLocal } = useUserStore();

  const { data: userServer, status: userServerStatus } = useQuery({
    queryKey: ["getUser"],
    refetchOnWindowFocus: false,
    queryFn: async () => await getUser(session?.user.email),
  });

  useEffect(() => {
    if (userServerStatus === "success" && userServer && !userLocal) {
      setUserLocal(userServer);
    }
  }, [userServer]);

  return <>{children}</>;
}
