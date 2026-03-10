import { Home } from "lucide-react";
import PageHeader from "./PageHeader";

export default function ActivityHeader() {
  return (
    <PageHeader
      icon={Home}
      to="/home"
      title="Attendance Log"
      subtitle="Your daily details"
    />
  );
}
