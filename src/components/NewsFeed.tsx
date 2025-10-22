import React from 'react';
import type { NewsItem } from '../types';

type NewsFeedProps = {
  /** Array of news items to render */
  news?: NewsItem[] | null;
  /** Optional heading override */
  title?: string;
};

/** Return Tailwind text color based on sentiment score */
const getScoreColor = (score: number) => {
  if (score > 0.3) return 'text-green-400';
  if (score < -0.3) return 'text-red-400';
  return 'text-gray-400';
};

/** Safe score formatter that tolerates undefined/null/NaN */
const formatScore = (score?: number | null) => {
  const val = typeof score === 'number' && isFinite(score) ? score : 0;
  return {
    value: val,
    text: val.toFixed(2),
    color: getScoreColor(val),
  };
};

const NewsFeed: React.FC<NewsFeedProps> = ({ news, title = 'Recent News' }) => {
  const items = Array.isArray(news) ? news : [];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-white mb-3 border-b border-gray-700 pb-2">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No news available.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const scoreUI = formatScore(item.score);
            return (
              <div key={item.id} className="flex justify-between items-start text-sm">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-gray-300 hover:text-white pr-4 underline-offset-2 hover:underline"
                  >
                    {item.headline}
                  </a>
                ) : (
                  <p className="text-gray-300 pr-4">{item.headline}</p>
                )}

                <span className={`font-bold whitespace-nowrap ${scoreUI.color}`}>
                  {scoreUI.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
