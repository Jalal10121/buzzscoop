"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Root() {
  const router = useRouter();
  useEffect(() => { router.replace("/panel-24e075625579/login"); }, [router]);
  return <div className="p-10">Redirecting...</div>;
}