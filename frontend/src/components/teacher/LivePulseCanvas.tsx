import { motion } from 'framer-motion';
import type { TopicCluster } from '../../types';
import { TOPIC_CLUSTERS } from '../../data/mockData';

const PATTERN_FILL: Record<string, string> = {
  confusion: '#E85D5D',
  curiosity: '#DAA520',
  clarity: '#34C759',
  wonder: '#7C5CBF',
};

interface LivePulseCanvasProps {
  onSelectCluster?: (cluster: TopicCluster) => void;
}

export default function LivePulseCanvas({ onSelectCluster }: LivePulseCanvasProps) {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl border border-slate-100 bg-surface-card overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #5D3FD3 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Clusters */}
      {TOPIC_CLUSTERS.map((cluster, i) => {
        const scaledSize = cluster.size * 1.3;
        return (
          <motion.button
            key={cluster.id}
            onClick={() => onSelectCluster?.(cluster)}
            className="absolute rounded-full flex flex-col items-center justify-center cursor-pointer border-0 bg-transparent p-0"
            style={{
              left: `${cluster.x}%`,
              top: `${cluster.y}%`,
              width: scaledSize,
              height: scaledSize,
            }}
            initial={{ opacity: 0, scale: 0.6, x: '-50%', y: -scaledSize / 2 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: '-50%',
              y: [-scaledSize / 2, -scaledSize / 2 - 12, -scaledSize / 2],
            }}
            transition={{
              opacity: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
              scale: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
              y: {
                duration: i % 2 === 0 ? 6 : 8,
                delay: i * 0.1 + 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${PATTERN_FILL[cluster.pattern]}20 0%, ${PATTERN_FILL[cluster.pattern]}08 70%)`,
                border: `1.5px solid ${PATTERN_FILL[cluster.pattern]}30`,
              }}
            />
            {/* Core */}
            <motion.div
              className="rounded-full z-10"
              style={{
                width: scaledSize * 0.35,
                height: scaledSize * 0.35,
                background: PATTERN_FILL[cluster.pattern],
              }}
              animate={{ opacity: [0.7, 0.5, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Label */}
            <span className="absolute -bottom-6 text-[10px] font-medium text-gray-500 whitespace-nowrap z-10">
              {cluster.label}
            </span>
            {/* Count */}
            <span className="absolute -top-1 -right-1 bg-white rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-sm z-10" style={{ color: PATTERN_FILL[cluster.pattern] }}>
              {cluster.count}
            </span>
          </motion.button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 right-5 flex gap-3">
        {Object.entries(PATTERN_FILL).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-gray-400 capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
