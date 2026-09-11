import { colors } from '@/constants/colors';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ANIMATION_DURATION_MS = 700;
/** Raise this to make the % text bigger (e.g. 0.32). */
const PERCENT_FONT_RATIO = 0.23;

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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedOffset = useRef(new Animated.Value(circumference)).current;
  const fontSize = size * PERCENT_FONT_RATIO;

  useEffect(() => {
    const animation = Animated.timing(animatedOffset, {
      toValue: circumference * (1 - clamped / 100),
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();

    return () => animation.stop();
  }, [animatedOffset, circumference, clamped]);

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Profile completion'}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute' }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={animatedOffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View
        className="items-center justify-center"
        style={{ width: size - strokeWidth * 2 }}
        importantForAccessibility="no-hide-descendants"
      >
        <Text
          className="font-jakarta-extrabold text-brand-navy text-center"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ fontSize, lineHeight: fontSize * 1.15 }}
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
