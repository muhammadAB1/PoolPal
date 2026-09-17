import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type SearchSelectionItem = {
    id: string;
    label: string;
    leading?: string;
};

type SearchSelectionModalProps = {
    visible: boolean;
    title: string;
    placeholder: string;
    items: SearchSelectionItem[];
    selectedId?: string | null;
    onClose: () => void;
    onSelect: (item: SearchSelectionItem) => void;
    onQueryChange?: (query: string) => void;
    closeLabel?: string;
    emptyLabel?: string;
};

export default function SearchSelectionModal({
    visible,
    title,
    placeholder,
    items,
    selectedId,
    onClose,
    onSelect,
    onQueryChange,
    closeLabel = 'Close',
    emptyLabel,
}: SearchSelectionModalProps) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        if (onQueryChange) return items;
        const needle = query.trim().toLocaleLowerCase();
        if (!needle) return items;
        return items.filter((item) => item.label.toLocaleLowerCase().includes(needle));
    }, [items, onQueryChange, query]);

    function handleQueryChange(value: string) {
        setQuery(value);
        onQueryChange?.(value);
    }

    function close() {
        setQuery('');
        onQueryChange?.('');
        onClose();
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View className="flex-row items-center justify-between px-5 pt-2 pb-3 border-b border-border-default">
                        <Text className="text-h2 font-jakarta-extrabold text-brand-navy flex-1 pr-4">{title}</Text>
                        <TouchableOpacity
                            onPress={close}
                            className="w-10 h-10 rounded-full bg-surface-bg items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel={closeLabel}
                        >
                            <Ionicons name="close" size={22} color="#0B2E4A" />
                        </TouchableOpacity>
                    </View>

                    <View className="px-5 pt-4 pb-2">
                        <View className="form-input flex-row items-center gap-2">
                            <Ionicons name="search" size={19} color="#667085" />
                            <TextInput
                                value={query}
                                onChangeText={handleQueryChange}
                                placeholder={placeholder}
                                placeholderTextColor="#98A2B3"
                                autoCorrect={false}
                                autoCapitalize="none"
                                className="flex-1 p-0 text-body font-jakarta text-charcoal"
                            />
                        </View>
                    </View>

                    <FlatList
                        data={filtered}
                        ListEmptyComponent={emptyLabel ? (
                            <Text className="text-body font-jakarta text-sub text-center py-8">{emptyLabel}</Text>
                        ) : null}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
                        renderItem={({ item }) => {
                            const selected = item.id === selectedId;
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item);
                                        close();
                                    }}
                                    activeOpacity={0.76}
                                    className={`min-h-14 flex-row items-center px-3.5 py-3 border-b border-border-default ${selected ? 'bg-surface-mint' : 'bg-surface-white'}`}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected }}
                                >
                                    {item.leading ? <Text className="text-[22px] mr-3">{item.leading}</Text> : null}
                                    <Text className={`flex-1 text-body font-jakarta ${selected ? 'font-jakarta-bold text-brand-navy' : 'text-charcoal'}`}>
                                        {item.label}
                                    </Text>
                                    {selected ? <Ionicons name="checkmark-circle" size={22} color="#0E97DC" /> : null}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
