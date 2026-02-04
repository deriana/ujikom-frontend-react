import ErrorPage from "@/components/system/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      message="We can’t seem to find the page you are looking for."
      lightImage="/images/error/404.svg"
      darkImage="/images/error/404-dark.svg"
    />
  );
}
