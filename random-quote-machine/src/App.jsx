import { useState } from "react";

// RandomQuoteMachine - single-file React component suitable for CodePen/CodeSandbox/CRA
// - Meets freeCodeCamp user stories (ids: quote-box, text, author, new-quote, tweet-quote)
// - Uses Quotable API with a small local fallback list
// - Includes simple responsive styling (no external CSS needed)

export default function RandomQuoteMachine() {
  const FALLBACK_QUOTES = [
    { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { content: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
    { content: "So many books, so little time.", author: "Frank Zappa" },
    { content: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  ];

  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [backgroundColor, setBackgroundColor] = useState('#000000'); // Initial background color

  async function fetchRandomQuote() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.quotable.io/random");
      if (!res.ok) {
        Error(`API responded with status ${res.status}`);
      }
      const data = await res.json() // API returns => data = {content, author}
      setQuote({ content: data.content, author: data.author || "unknown" });
    }
    catch (error) {
      // If network or API fails, pick random fallback quote
      console.warn("Quote API failed, using fallback", error);
      const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(fallback);
      setError("Using fallback quotes (API unavailable)");
    }
    finally {
      setLoading(false);
    }
  }

  function buildTweetHref() {
    const text = `"${quote.content}" — ${quote.author}`;
    const maxLength = 280 - 24;
    let finalText = text;
    if (finalText.length > maxLength) {
      finalText = finalText.slice(0, maxLength - 1) + "…";
    }
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set("text", finalText);
    return url.toString();
  }

  const generateRandomHexColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  const fetchQuoteAndChangeColors = () => {
    fetchRandomQuote();
    setBackgroundColor(generateRandomHexColor());
  };

  // Simple inline styles so this component is self-contained
  const containerStyle = {
    minHeight: "90vh",
    width: "95vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(135deg,#f6f8ff,#e8f0ff)",
    fontFamily: "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial",
  };


  const boxStyle = {
    width: "min(720px, 92vw)",
    background: "white",
    borderRadius: "12px",
    padding: "1.6rem",
    boxShadow: "0 8px 30px rgba(12,20,40,0.08)",
  };


  const textStyle = {
    fontSize: "clamp(1.05rem, 2.2vw, 1.5rem)",
    lineHeight: 1.4,
    marginBottom: "0.75rem",
  };


  const authorStyle = {
    textAlign: "right",
    fontWeight: 600,
    marginBottom: "1rem",
  };


  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  };


  const btnStyle = {
    padding: "0.5rem 0.9rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <diV style={{...containerStyle, background: backgroundColor}}>
      <div id="quote-box" style={boxStyle} aria-live="polite">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ margin: 0, color: "black" }}>Random Quote Machine</h2>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            {loading ? "Loading…" : error ? "Offline mode" : ""}
          </div>
        </div>

        <p id="text" style={{ ...textStyle, color: backgroundColor }}>
          {quote.content}
        </p>


        <p id="author" style={{ ...authorStyle, color: backgroundColor }}>
          — {quote.author}
        </p>

        <div style={footerStyle}>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            {/* Tweet link (User Story 5 & 10) */}
            <a
              id="tweet-quote"
              href={buildTweetHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tweet this quote">
              <button style={{ ...btnStyle, background: "#1da1f2", color: "white" }}>
                Tweet
              </button>
            </a>


            {/* New quote button (User Story 4, 8, 9) */}
            <button
              id="new-quote"
              onClick={fetchQuoteAndChangeColors}
              style={{ ...btnStyle, background: "#111827", color: "white" }}>
              New Quote
            </button>
          </div>


          <div style={{ fontSize: "0.85rem", color: "#666" }}>Built with Quotable API</div>
        </div>
      </div>

    </diV>
  )
}

