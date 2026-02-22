import type { ThinkingPattern } from '../../types';
import { PATTERN_LABELS } from '../../types';

interface PatternBadgeProps {
  pattern: ThinkingPattern;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BADGE_STYLES: Record<ThinkingPattern, string> = {
  confusion: 'bg-confusion-light text-confusion',
  curiosity: 'bg-curiosity-light text-curiosity',
  clarity: 'bg-clarity-light text-clarity',
};

const DOT_STYLES: Record<ThinkingPattern, string> = {
  confusion: 'bg-confusion',
  curiosity: 'bg-curiosity',
  clarity: 'bg-clarity',
};

const SIZES = {
  sm: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-3 py-1' },
  md: { dot: 'w-2.5 h-2.5', text: 'text-sm', padding: 'px-4 py-1.5' },
  lg: { dot: 'w-3 h-3', text: 'text-base', padding: 'px-5 py-2' },
};

export default function PatternBadge({ pattern, showLabel = true, size = 'md' }: PatternBadgeProps) {
  const s = SIZES[size];

  if (!showLabel) {
    return <span className={`inline-block rounded-full ${s.dot} ${DOT_STYLES[pattern]}`} />;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${s.padding} ${s.text} ${BADGE_STYLES[pattern]}`}>
      <span className={`inline-block rounded-full ${s.dot} ${DOT_STYLES[pattern]}`} />
      {PATTERN_LABELS[pattern]}
    </span>
  );
}
