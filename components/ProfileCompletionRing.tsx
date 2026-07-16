import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

type ProfileCompletionRingProps = {
  /** Completion value from 0–100 (e.g. profile_completion_score). */
  percentage: number;
  size?: number;
  strokeWidth?: number;
  /** Optional subtitle under the percentage (e.g. "profile complete"). */
  label?: string;
  progressColor?: string;
  trackColor?: string;
};

const TICK_COUNT = 72;

/**
 * Reusable circular profile-completion indicator.
 * Accepts a 0–100 percentage and renders a track + progress ring
 * with centered percentage (and optional label) text.
 */
export default function ProfileCompletionRing({
  percentage,
  size = 148,
  strokeWidth = 12,
  label,
  progressColor = colors.brand.aqua,
  trackColor = '#E6EEF0',
}: ProfileCompletionRingProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const filledTicks = Math.round((clamped / 100) * TICK_COUNT);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Slight overlap so ticks read as a continuous ring
  const tickWidth = circumference / TICK_COUNT + 0.6;

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      {Array.from({ length: TICK_COUNT }).map((_, index) => {
        const angle = (index / TICK_COUNT) * 360 - 90;
        const radians = (angle * Math.PI) / 180;
        const isFilled = index < filledTicks;

        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: tickWidth,
              height: strokeWidth,
              borderRadius: strokeWidth / 2,
              backgroundColor: isFilled ? progressColor : trackColor,
              left: size / 2 + radius * Math.cos(radians) - tickWidth / 2,
              top: size / 2 + radius * Math.sin(radians) - strokeWidth / 2,
              transform: [{ rotate: `${angle + 90}deg` }],
            }}
          />
        );
      })}

      <View className="items-center justify-center px-3">
        <Text
          className="font-jakarta-extrabold text-brand-navy"
          style={{ fontSize: size * 0.26, lineHeight: size * 0.3 }}
        >
          {clamped}%
        </Text>
        {label ? (
          <Text
            className="font-jakarta text-sub text-center"
            style={{ fontSize: Math.max(10, size * 0.075), marginTop: 2 }}
          >
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
