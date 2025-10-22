# NewsFeed component (TypeScript + React + Tailwind)

Component aggiornato con migliorie e fix di robustezza.

## Cosa cambia rispetto alla tua versione
- **Key stabile**: usa `item.id` invece di `index`.
- **Score sicuro**: tollera `undefined/null/NaN` e mostra `0.00` di fallback.
- **Colore coerente**: `getScoreColor` applicato dopo sanificazione del valore.
- **Titolo opzionale**: prop `title` con default `Recent News`.
- **Link opzionale**: se `item.url` è presente, l'headline diventa un link (con `rel`/`target` sicuri).
- **Empty state**: messaggio quando la lista è vuota o non definita.
- **Type migliorato**: `NewsItem` include `id`, `headline`, `score?`, `url?`.

## Tipi
Vedi `src/types.ts`:
```ts
export interface NewsItem {
  id: string;
  headline: string;
  score?: number | null;
  url?: string | null;
}
```

## Uso
```tsx
import NewsFeed from './src/components/NewsFeed';
import type { NewsItem } from './src/types';

const data: NewsItem[] = [
  { id: 'a1', headline: 'NVIDIA beats earnings', score: 0.72, url: 'https://example.com/a1' },
  { id: 'b2', headline: 'Fed decision incoming', score: -0.18 },
];

<NewsFeed news={data} title="Nasdaq — Latest News" />
```

## Note
- L'import di `React` resta per compatibilità, anche se col nuovo JSX transform non è più strettamente necessario.
- Lo stile usa **Tailwind** (classi di base, nessuna dipendenza extra).
