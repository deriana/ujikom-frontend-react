import ErrorPage from "@/components/system/ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage
      code={403}
      title="Access Denied"
      message="You don’t have permission to access this page."
      lightImage="/images/error/503.svg"
      darkImage="/images/error/503-dark.svg"
    />
  );
}
