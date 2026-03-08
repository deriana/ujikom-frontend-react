import { getQuote } from "@/api/quote.api";
import { useQuery } from "@tanstack/react-query";

export default function Quote() {
  const { data: quote } = useQuery({
    queryKey: ["random-quote"],
    queryFn: async () => {
      const data = await getQuote();
      return data.quote || data;
    },
    refetchInterval: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    initialData: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    retry: false,
  });

  return <>{quote || "Success is not final, failure is not fatal: it is the courage to continue that counts."}</>;
}