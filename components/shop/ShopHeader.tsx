import { Text, View } from 'react-native';
import BackButton from './BackButton';
import ListButton from './ListButton';

type ShopHeaderProps = {
  title: string;
  subtitle?: string;
  /** Shows the "My list" shortcut on the right. */
  showList?: boolean;
};

/**
 * Back button, optional list shortcut, and a large title for inner shop screens.
 */
export default function ShopHeader({ title, subtitle, showList = false }: ShopHeaderProps) {
  return (
    <View className="px-5 pt-2 pb-4">
      <View className="flex-row items-center justify-between">
        <BackButton />
        {showList ? <ListButton /> : null}
      </View>
      <Text className="text-h1 font-jakarta-extrabold text-brand-navy mt-4">{title}</Text>
      {subtitle ? (
        <Text className="text-body font-jakarta text-sub mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
}
