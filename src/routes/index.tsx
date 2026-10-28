import { createFileRoute } from "@tanstack/react-router";
import { CenterApp } from "@/components/center-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CenterApp />;
}