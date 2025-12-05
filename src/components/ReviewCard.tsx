import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
interface ReviewCardProps {
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ reviewer_name, rating, review_text, created_at }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{reviewer_name.charAt(0)}</Text>
        </View>
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
  );
};
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  header: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  stars: { fontSize: 14, marginRight: 8 },
  date: { fontSize: 12, color: '#666' },
  reviewText: { fontSize: 14, color: '#333', lineHeight: 20 },
});
export default ReviewCard;