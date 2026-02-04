import ErrorPage from "@/components/system/ErrorPage";

export default function Maintenance() {
  return (
    <ErrorPage
      code={503}
      title="Maintenance"
      message="System is under maintenance. Please come back later."
      lightImage="/images/error/maintenance.svg"
      darkImage="/images/error/maintenance-dark.svg"
    />
  );
}
