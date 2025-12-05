import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

interface ReviewCardProps {
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ reviewer_name, rating, review_text, created_at }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: 12,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stars: {
      fontSize: 14,
      marginRight: 8,
    },
    date: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    reviewText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  return (
    <GlassCard style={styles.card} intensity="light">
      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={theme.gradients.accent as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{reviewer_name.charAt(0)}</Text>
          </LinearGradient>
          <View style={styles.info}>
            <Text style={styles.name}>{reviewer_name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.stars}>{'⭐'.repeat(rating)}</Text>
              <Text style={styles.date}>{new Date(created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.reviewText}>{review_text}</Text>
      </View>
    </GlassCard>
  );
};

export default ReviewCard;