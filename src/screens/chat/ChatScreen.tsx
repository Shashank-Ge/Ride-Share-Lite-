import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    Message,
} from '../../services/database';
import { supabase } from '../../services/supabase';

interface ChatParams {
    bookingId: string;
    otherUser: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    ride: {
        from_location: string;
        to_location: string;
    };
}

const ChatScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { session } = useAuth();
    const params = route.params as ChatParams;

    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        loadMessages();
        subscribeToMessages();

        return () => {
            // Cleanup subscription
        };
    }, []);

    const loadMessages = async () => {
        const dbMessages = await fetchMessages(params.bookingId);
        const giftedMessages = convertToGiftedFormat(dbMessages);
        setMessages(giftedMessages);

        // Mark messages as read
        if (session?.user?.id) {
            await markMessagesAsRead(params.bookingId, session.user.id);
        }
    };

    const subscribeToMessages = () => {
        // Subscribe to new messages using Supabase Realtime
        const channel = supabase
            .channel(`messages:${params.bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `booking_id=eq.${params.bookingId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    const giftedMessage = convertMessageToGifted(newMessage);
                    setMessages((previousMessages) =>
                        GiftedChat.append(previousMessages, [giftedMessage])
                    );

                    // Mark as read if not sent by current user
                    if (newMessage.sender_id !== session?.user?.id) {
                        markMessagesAsRead(params.bookingId, session?.user?.id || '');
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const convertToGiftedFormat = (dbMessages: Message[]): IMessage[] => {
        return dbMessages.map((msg) => convertMessageToGifted(msg)).reverse();
    };

    const convertMessageToGifted = (msg: Message): IMessage => {
        return {
            _id: msg.id,
            text: msg.message,
            createdAt: new Date(msg.created_at),
            user: {
                _id: msg.sender_id,
                name: msg.sender?.full_name || 'User',
                avatar: msg.sender?.avatar_url,
            },
        };
    };

    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        const message = newMessages[0];

        if (!session?.user?.id || !message.text) return;

        // Optimistically add message to UI
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );

        // Send to database
        await sendMessage({
            booking_id: params.bookingId,
            sender_id: session.user.id,
            receiver_id: params.otherUser.id,
            message: message.text,
        });
    }, [params.bookingId, params.otherUser.id, session?.user?.id]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>‹</Text>
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{params.otherUser.full_name}</Text>
                    <Text style={styles.headerRoute}>
                        {params.ride.from_location} → {params.ride.to_location}
                    </Text>
                </View>
            </View>

            {/* Chat */}
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: session?.user?.id || '',
                    name: session?.user?.email || 'You',
                }}
                placeholder="Type a message..."
                alwaysShowSend
                scrollToBottom
                renderAvatar={null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#007AFF', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    backButton: { fontSize: 32, color: '#fff', marginRight: 12 },
    headerInfo: { flex: 1 },
    headerName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    headerRoute: { fontSize: 13, color: '#fff', opacity: 0.9 },
});

export default ChatScreen;
