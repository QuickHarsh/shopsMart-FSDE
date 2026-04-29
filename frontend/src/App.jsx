import { useEffect, useState } from "react";

const defaultQuery = "iPhone 13";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRating(value) {
  return value.toFixed(1);
}

function buildChart(history) {
  if (!history.length) {
    return { line: "", dots: [] };
  }

  const width = 620;
  const height = 240;
  const padding = 32;
  const prices = history.map((point) => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const span = Math.max(maxPrice - minPrice, 1);
  const step =
    history.length > 1 ? (width - padding * 2) / (history.length - 1) : 0;

  const dots = history.map((point, index) => {
    const x = padding + step * index;
    const y =
      height -
      padding -
      ((point.price - minPrice) / span) * (height - padding * 2);
    return {
      ...point,
      x,
      y,
    };
  });

  const line = dots.map((point) => `${point.x},${point.y}`).join(" ");

  return { line, dots };
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getRecommendationLabel(key) {
  if (key === "bestValue") return "Best value";
  if (key === "highestRated") return "Highest rated";
  return "Budget alternative";
}

function App() {
  const [inputValue, setInputValue] = useState(defaultQuery);
  const [searchTerm, setSearchTerm] = useState(defaultQuery);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertForm, setAlertForm] = useState({ email: "", threshold: "" });
  const [alertMessage, setAlertMessage] = useState("");

  async function loadProduct(query) {
    const trimmedQuery = query.trim() || defaultQuery;
    setIsLoading(true);
    setError("");
    setAlertMessage("");

    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(trimmedQuery)}`,
      );

      if (!response.ok) {
        throw new Error(
          "No product matched your search. Try iPhone 13, Galaxy S23, or AirPods Pro.",
        );
      }

      const data = await response.json();
      setDashboard(data);
      setSearchTerm(trimmedQuery);
    } catch (fetchError) {
      setError(fetchError.message);
      setDashboard(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProduct(defaultQuery);
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    void loadProduct(inputValue);
  }

  function handleAlertChange(event) {
    const { name, value } = event.target;
    setAlertForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAlertSubmit(event) {
    event.preventDefault();

    if (!dashboard) {
      setAlertMessage("Search a product before creating an alert.");
      return;
    }

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: dashboard.product.id,
          email: alertForm.email,
          threshold: Number(alertForm.threshold),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to create alert.");
      }

      setAlertMessage(
        `${payload.alert.email} will be notified when ${dashboard.product.name} drops to ${formatPrice(payload.alert.threshold)} or below.`,
      );
      setAlertForm({ email: "", threshold: "" });
    } catch (submitError) {
      setAlertMessage(submitError.message);
    }
  }

  const chart = dashboard
    ? buildChart(dashboard.history)
    : { line: "", dots: [] };
  const bestOffer = dashboard?.comparisons[0];
  const maxOffer = dashboard?.comparisons[dashboard.comparisons.length - 1];
  const spread = bestOffer && maxOffer ? maxOffer.price - bestOffer.price : 0;

  return (
    <div className="app-shell">
      <div className="noise" />
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      <main className="page-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">ShopSmart Price Comparison Engine</p>
            <h1>Find the best buy faster than a dozen open tabs.</h1>
            <p className="hero-text">
              Search a product and get live comparison rows, price history, drop
              alerts, smart recommendations, and review summaries in one screen.
            </p>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <label className="sr-only" htmlFor="product-search">
                Search for a product
              </label>
              <input
                id="product-search"
                name="product-search"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Search iPhone 13, Galaxy S23, AirPods Pro..."
              />
              <button type="submit">Compare</button>
            </form>

            <div className="quick-pills">
              {["iPhone 13", "Galaxy S23", "AirPods Pro", "MacBook Air M2"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      item === searchTerm ? "pill pill-active" : "pill"
                    }
                    onClick={() => {
                      setInputValue(item);
                      void loadProduct(item);
                    }}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="hero-panel">
            <div className="status-chip">Realtime comparison snapshot</div>
            <div className="metric-grid">
              <div className="metric-card accent">
                <span>Lowest price</span>
                <strong>
                  {bestOffer ? formatPrice(bestOffer.price) : "—"}
                </strong>
                <small>
                  {bestOffer ? bestOffer.platform : "Waiting for data"}
                </small>
              </div>
              <div className="metric-card">
                <span>Price spread</span>
                <strong>{spread ? formatPrice(spread) : "—"}</strong>
                <small>Savings between cheapest and highest listing</small>
              </div>
              <div className="metric-card">
                <span>Search mode</span>
                <strong>{isLoading ? "Loading" : "Ready"}</strong>
                <small>
                  {dashboard ? dashboard.product.category : "API powered"}
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <article className="panel panel-wide">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Multi-platform comparison</p>
                <h2>
                  {dashboard ? dashboard.product.name : "Price comparison"}
                </h2>
              </div>
              <span className="mono-badge">
                {dashboard ? dashboard.product.category : "Comparing"}
              </span>
            </div>

            {error ? <div className="notice notice-error">{error}</div> : null}
            {isLoading && !dashboard ? (
              <div className="notice">
                Loading price rows and recommendations...
              </div>
            ) : null}

            {dashboard ? (
              <div className="table-shell">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Availability</th>
                      <th>Savings</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.comparisons.map((row) => (
                      <tr key={row.platform}>
                        <td>{row.platform}</td>
                        <td>{formatPrice(row.price)}</td>
                        <td>{formatRating(row.rating)}</td>
                        <td>{row.availability}</td>
                        <td>
                          {row.savings
                            ? `${formatPrice(row.savings)} less`
                            : "Best price"}
                        </td>
                        <td>
                          <a href={row.url} target="_blank" rel="noreferrer">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Price history</p>
                <h2>Trendline</h2>
              </div>
              <span className="mono-badge">
                {dashboard ? dashboard.history.length : 0} points
              </span>
            </div>

            {dashboard ? (
              <div className="chart-card">
                <svg
                  viewBox="0 0 620 240"
                  className="history-chart"
                  role="img"
                  aria-label="Price history chart"
                >
                  <defs>
                    <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(109, 210, 237, 0.45)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(109, 210, 237, 0.03)"
                      />
                    </linearGradient>
                  </defs>
                  <polyline
                    className="history-area"
                    points={`32,208 ${chart.line} 588,208`}
                  />
                  <polyline className="history-line" points={chart.line} />
                  {chart.dots.map((point) => (
                    <g key={point.date}>
                      <circle cx={point.x} cy={point.y} r="5" />
                      <text
                        x={point.x}
                        y={220}
                        textAnchor="middle"
                        className="chart-label"
                      >
                        {formatDate(point.date)}
                      </text>
                    </g>
                  ))}
                </svg>
                <div className="chart-footnote">
                  <span>
                    Lowest observed price:{" "}
                    {formatPrice(
                      Math.min(
                        ...dashboard.history.map((point) => point.price),
                      ),
                    )}
                  </span>
                  <span>
                    Latest price:{" "}
                    {formatPrice(
                      dashboard.history[dashboard.history.length - 1].price,
                    )}
                  </span>
                </div>
              </div>
            ) : null}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Recommendation engine</p>
                <h2>Best fit</h2>
              </div>
              <span className="mono-badge">AI-style sorting</span>
            </div>

            {dashboard ? (
              <div className="recommendation-list">
                {Object.entries(dashboard.recommendation).map(
                  ([key, offer]) => (
                    <div key={key} className="recommendation-card">
                      <div>
                        <p>{getRecommendationLabel(key)}</p>
                        <strong>{offer.platform}</strong>
                      </div>
                      <div className="recommendation-meta">
                        <span>{formatPrice(offer.price)}</span>
                        <span>{formatRating(offer.rating)}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </article>

          <article className="panel panel-compact">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Price drop alerts</p>
                <h2>Notify me</h2>
              </div>
              <span className="mono-badge">Email</span>
            </div>

            <form className="alert-form" onSubmit={handleAlertSubmit}>
              <input
                type="email"
                name="email"
                value={alertForm.email}
                onChange={handleAlertChange}
                placeholder="you@example.com"
                required
              />
              <input
                type="number"
                name="threshold"
                value={alertForm.threshold}
                onChange={handleAlertChange}
                placeholder="Target price in INR"
                min="1"
                required
              />
              <button type="submit">Create alert</button>
            </form>
            {alertMessage ? (
              <div className="notice notice-success">{alertMessage}</div>
            ) : null}
            <p className="support-text">
              Alerts are stored by the backend and can later route into email or
              WhatsApp notifications.
            </p>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Review summary</p>
                <h2>Pros and cons</h2>
              </div>
              <span className="mono-badge">AI summary</span>
            </div>

            {dashboard ? (
              <div className="summary-grid">
                <div>
                  <h3>Pros</h3>
                  <ul className="summary-list">
                    {dashboard.reviewSummary.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Cons</h3>
                  <ul className="summary-list summary-list-muted">
                    {dashboard.reviewSummary.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Related products</p>
                <h2>Explore more</h2>
              </div>
              <span className="mono-badge">
                {dashboard ? dashboard.relatedProducts.length : 0} items
              </span>
            </div>

            {dashboard ? (
              <div className="related-grid">
                {dashboard.relatedProducts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="related-card"
                    onClick={() => {
                      setInputValue(item.name);
                      void loadProduct(item.name);
                    }}
                  >
                    <span>{item.category}</span>
                    <strong>{item.name}</strong>
                    <small>Open comparison</small>
                  </button>
                ))}
              </div>
            ) : null}
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
