import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { fetchConversations, Conversation } from '../../services/database';

const ChatListScreen = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        if (!session?.user?.id) return;

        const data = await fetchConversations(session.user.id);
        setConversations(data);
        setLoading(false);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadConversations();
    };

    const handleConversationPress = (conversation: Conversation) => {
        (navigation as any).navigate('Chat', {
            bookingId: conversation.booking_id,
            otherUser: conversation.other_user,
            ride: conversation.ride,
        });
    };

    const renderConversation = ({ item }: { item: Conversation }) => {
        const timeAgo = getTimeAgo(item.last_message_time);

        return (
            <TouchableOpacity
                style={styles.conversationCard}
                onPress={() => handleConversationPress(item)}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.other_user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>

                <View style={styles.conversationInfo}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.userName}>{item.other_user.full_name || 'User'}</Text>
                        <Text style={styles.time}>{timeAgo}</Text>
                    </View>

                    <Text style={styles.route} numberOfLines={1}>
                        {item.ride?.from_location} → {item.ride?.to_location}
                    </Text>

                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.last_message}
                    </Text>
                </View>

                {item.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread_count}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now.getTime() - time.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            {conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    renderItem={renderConversation}
                    keyExtractor={(item) => item.booking_id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>💬</Text>
                    <Text style={styles.emptyTitle}>No Messages Yet</Text>
                    <Text style={styles.emptyText}>
                        Start a conversation with your ride partners
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    conversationCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    conversationInfo: { flex: 1 },
    conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    time: { fontSize: 12, color: '#999' },
    route: { fontSize: 13, color: '#666', marginBottom: 4 },
    lastMessage: { fontSize: 14, color: '#999' },
    unreadBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    unreadText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
});

export default ChatListScreen;
