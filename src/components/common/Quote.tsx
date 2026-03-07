import { getQuote } from "@/api/quote.api";
import { useEffect, useState } from "react";

export default function Quote() {
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await getQuote();
        console.log(data);
        setQuote(data.quote || data);
      } catch (error) {
        setQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.");
      }
    };
    fetchQuote();
  }, []);

  return <>{quote}</>;
}