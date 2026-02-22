import { motion } from 'framer-motion';
import { TOPIC_CLUSTERS } from '../../data/mockData';

const PATTERN_FILL: Record<string, string> = {
  confusion: '#E85D5D',
  curiosity: '#DAA520',
  clarity: '#34C759',
  wonder: '#7C5CBF',
};

const PATTERN_FILL_LIGHT: Record<string, string> = {
  confusion: 'rgba(232, 93, 93, 0.12)',
  curiosity: 'rgba(218, 165, 32, 0.12)',
  clarity: 'rgba(52, 199, 89, 0.12)',
  wonder: 'rgba(124, 92, 191, 0.12)',
};

export default function BubbleClusterVisual() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[360px] md:h-[420px]">
      {TOPIC_CLUSTERS.map((cluster, i) => (
        <motion.div
          key={cluster.id}
          className="absolute flex items-center justify-center rounded-full cursor-default"
          style={{
            left: `${cluster.x}%`,
            top: `${cluster.y}%`,
            width: cluster.size,
            height: cluster.size,
            background: PATTERN_FILL_LIGHT[cluster.pattern],
            border: `2px solid ${PATTERN_FILL[cluster.pattern]}30`,
          }}
          initial={{ opacity: 0, scale: 0.6, x: '-50%', y: -cluster.size / 2 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: '-50%',
            y: [-cluster.size / 2, -cluster.size / 2 - 12, -cluster.size / 2],
          }}
          transition={{
            opacity: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
            scale: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
            y: {
              duration: i % 2 === 0 ? 6 : 8,
              delay: i * 0.15 + 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Inner dot */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: cluster.size * 0.3,
              height: cluster.size * 0.3,
              background: PATTERN_FILL[cluster.pattern],
            }}
            animate={{ opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Label */}
          {cluster.size > 50 && (
            <span className="absolute -bottom-7 whitespace-nowrap text-xs font-medium text-gray-500">
              {cluster.label}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
