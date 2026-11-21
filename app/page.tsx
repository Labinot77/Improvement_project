import { redirect } from "next/navigation";

// Root sends users to the dashboard
export default function Home() {
  redirect("/main");
}
