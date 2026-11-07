import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

type InfoModalProps = {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
};

/** Small centered dialog used in place of the OS Alert for in-app info callouts. */
export default function InfoModal({ visible, title, message, onClose }: InfoModalProps) {
    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 items-center justify-center px-6"
                style={{ backgroundColor: 'rgba(7,59,92,0.45)' }}
                onPress={onClose}
            >
                <Pressable onPress={() => {}} className="w-full max-w-90 bg-surface-white rounded-3xl p-5">
                    <Text className="text-h3 font-jakarta-extrabold text-brand-navy">{title}</Text>
                    <Text className="text-body font-jakarta text-sub mt-2.5 leading-relaxed">
                        {message}
                    </Text>

                    <Pressable
                        onPress={onClose}
                        className="self-end bg-brand-blue rounded-full px-6 py-2.5 mt-5"
                    >
                        <Text className="text-body font-jakarta-bold text-surface-white">
                            {t('common_ok')}
                        </Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
