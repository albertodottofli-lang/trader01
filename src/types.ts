export interface NewsItem {
  id: string;
  headline: string;
  /** Sentiment score in range [-1, 1]. Optional. */
  score?: number | null;
  /** Optional URL to the full article */
  url?: string | null;
}
