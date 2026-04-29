const catalog = [
  {
    id: "iphone-13",
    name: "iPhone 13",
    category: "Smartphone",
    aliases: ["iphone 13", "iphone13", "apple iphone 13"],
    platformOffers: [
      {
        platform: "Amazon",
        price: 49999,
        rating: 4.5,
        url: "https://www.amazon.in/",
        availability: "In stock",
      },
      {
        platform: "Flipkart",
        price: 48499,
        rating: 4.4,
        url: "https://www.flipkart.com/",
        availability: "Limited stock",
      },
      {
        platform: "Croma",
        price: 50999,
        rating: 4.6,
        url: "https://www.croma.com/",
        availability: "In stock",
      },
    ],
    priceHistory: [
      { date: "2026-03-24", price: 51999 },
      { date: "2026-03-31", price: 50999 },
      { date: "2026-04-07", price: 49999 },
      { date: "2026-04-14", price: 48999 },
      { date: "2026-04-21", price: 48499 },
    ],
    reviewSummary: {
      pros: [
        "Excellent camera performance for the segment",
        "Strong battery life after recent price drop",
        "Best overall value on Flipkart in this snapshot",
      ],
      cons: [
        "Storage starts at a modest base tier",
        "Fast charging is still behind newer flagships",
      ],
    },
  },
  {
    id: "galaxy-s23",
    name: "Samsung Galaxy S23",
    category: "Smartphone",
    aliases: ["galaxy s23", "samsung s23", "s23"],
    platformOffers: [
      {
        platform: "Amazon",
        price: 57999,
        rating: 4.6,
        url: "https://www.amazon.in/",
        availability: "In stock",
      },
      {
        platform: "Flipkart",
        price: 56499,
        rating: 4.7,
        url: "https://www.flipkart.com/",
        availability: "In stock",
      },
      {
        platform: "Samsung Store",
        price: 59999,
        rating: 4.8,
        url: "https://www.samsung.com/in/",
        availability: "Ships in 2 days",
      },
    ],
    priceHistory: [
      { date: "2026-03-24", price: 60999 },
      { date: "2026-03-31", price: 59999 },
      { date: "2026-04-07", price: 58999 },
      { date: "2026-04-14", price: 57499 },
      { date: "2026-04-21", price: 56499 },
    ],
    reviewSummary: {
      pros: [
        "Top-tier display and performance",
        "Highest rating among the current offers",
      ],
      cons: [
        "Premium pricing remains above mid-range buyers",
        "The Amazon offer is cheaper but slightly less attractive on rating",
      ],
    },
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    aliases: ["airpods pro", "apple airpods pro", "airpods"],
    platformOffers: [
      {
        platform: "Amazon",
        price: 19999,
        rating: 4.7,
        url: "https://www.amazon.in/",
        availability: "In stock",
      },
      {
        platform: "Flipkart",
        price: 18999,
        rating: 4.5,
        url: "https://www.flipkart.com/",
        availability: "In stock",
      },
      {
        platform: "Reliance Digital",
        price: 19499,
        rating: 4.6,
        url: "https://www.reliancedigital.in/",
        availability: "In stock",
      },
    ],
    priceHistory: [
      { date: "2026-03-24", price: 20999 },
      { date: "2026-03-31", price: 20599 },
      { date: "2026-04-07", price: 19999 },
      { date: "2026-04-14", price: 19499 },
      { date: "2026-04-21", price: 18999 },
    ],
    reviewSummary: {
      pros: [
        "Clear price leader on Flipkart",
        "Balanced audio quality and noise cancellation",
      ],
      cons: [
        "Battery case pricing varies across sellers",
        "Occasional stock swings make alerts useful",
      ],
    },
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2",
    category: "Laptop",
    aliases: ["macbook air m2", "macbook air", "m2 macbook"],
    platformOffers: [
      {
        platform: "Amazon",
        price: 85999,
        rating: 4.8,
        url: "https://www.amazon.in/",
        availability: "In stock",
      },
      {
        platform: "Flipkart",
        price: 84499,
        rating: 4.7,
        url: "https://www.flipkart.com/",
        availability: "In stock",
      },
      {
        platform: "Apple Store",
        price: 89999,
        rating: 4.9,
        url: "https://www.apple.com/in/",
        availability: "Ships in 1 week",
      },
    ],
    priceHistory: [
      { date: "2026-03-24", price: 88999 },
      { date: "2026-03-31", price: 87999 },
      { date: "2026-04-07", price: 86999 },
      { date: "2026-04-14", price: 85999 },
      { date: "2026-04-21", price: 84499 },
    ],
    reviewSummary: {
      pros: [
        "Strong overall performance per rupee",
        "Great resale value keeps the recommendation score high",
      ],
      cons: [
        "Apple Store is the most expensive option",
        "No dramatic savings on the premium listing",
      ],
    },
  },
];

export function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findProduct(query = "") {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return catalog[0];
  }

  const scoredMatches = catalog.map((product) => {
    const name = normalizeText(product.name);
    const aliases = product.aliases.map((alias) => normalizeText(alias));
    const category = normalizeText(product.category);

    let score = 0;

    if (name === normalizedQuery) {
      score += 100;
    }

    if (name.includes(normalizedQuery)) {
      score += 60;
    }

    if (aliases.some((alias) => alias === normalizedQuery)) {
      score += 90;
    }

    if (aliases.some((alias) => alias.includes(normalizedQuery))) {
      score += 50;
    }

    const queryTerms = normalizedQuery.split(" ");
    for (const term of queryTerms) {
      if (!term) continue;
      if (name.includes(term)) score += 8;
      if (category.includes(term)) score += 5;
      if (aliases.some((alias) => alias.includes(term))) score += 6;
    }

    return { product, score };
  });

  scoredMatches.sort((left, right) => right.score - left.score);

  return scoredMatches[0].score > 0 ? scoredMatches[0].product : null;
}

export function buildComparisonRows(product) {
  const mostExpensive = Math.max(
    ...product.platformOffers.map((offer) => offer.price),
  );
  return product.platformOffers
    .map((offer) => ({
      platform: offer.platform,
      price: offer.price,
      rating: offer.rating,
      url: offer.url,
      availability: offer.availability,
      savings: mostExpensive - offer.price,
    }))
    .sort((left, right) => left.price - right.price);
}

export function buildRecommendation(product) {
  const sortedByValue = [...product.platformOffers].sort(
    (left, right) => right.rating / right.price - left.rating / left.price,
  );
  const sortedByRating = [...product.platformOffers].sort(
    (left, right) => right.rating - left.rating || left.price - right.price,
  );
  const sortedByPrice = [...product.platformOffers].sort(
    (left, right) => left.price - right.price,
  );

  return {
    bestValue: sortedByValue[0],
    highestRated: sortedByRating[0],
    budgetAlternative: sortedByPrice[0],
  };
}

export function buildDashboardData(query = "") {
  const product = findProduct(query);

  if (!product) {
    return null;
  }

  return {
    query,
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
    },
    comparisons: buildComparisonRows(product),
    history: product.priceHistory,
    recommendation: buildRecommendation(product),
    reviewSummary: product.reviewSummary,
    relatedProducts: catalog
      .filter((candidate) => candidate.id !== product.id)
      .slice(0, 3)
      .map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        category: candidate.category,
      })),
  };
}

export const alerts = [];

export function createAlert({ productId, email, threshold }) {
  const product = catalog.find((item) => item.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const currentBestPrice = Math.min(
    ...product.platformOffers.map((offer) => offer.price),
  );
  const alert = {
    id: `alert-${alerts.length + 1}`,
    productId,
    email,
    threshold,
    currentBestPrice,
    triggered: threshold >= currentBestPrice,
    createdAt: new Date().toISOString(),
  };

  alerts.unshift(alert);
  return alert;
}
