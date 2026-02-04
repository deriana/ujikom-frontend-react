import ErrorPage from "@/components/system/ErrorPage";

export default function ServerError() {
  return (
    <ErrorPage
      code={500}
      title="Server Error"
      message="Something went wrong on our side."
      lightImage="/images/error/500.svg"
      darkImage="/images/error/500-dark.svg"
    />
  );
}
