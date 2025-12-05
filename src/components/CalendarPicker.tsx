import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

interface CalendarPickerProps {
    visible: boolean;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
    minimumDate?: Date;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
    visible,
    selectedDate,
    onSelectDate,
    onClose,
    minimumDate = new Date(),
}) => {
    const { theme } = useTheme();
    const [currentMonth, setCurrentMonth] = useState(selectedDate);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days: (number | null)[] = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (minimumDate && newDate < minimumDate) {
            return;
        }

        onSelectDate(newDate);
        onClose();
    };

    const isDateDisabled = (day: number | null) => {
        if (day === null) return true;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date < today;
    };

    const isDateSelected = (day: number | null) => {
        if (day === null) return false;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const isToday = (day: number | null) => {
        if (day === null) return false;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarDays = generateCalendarDays();

    const { width } = Dimensions.get('window');
    const calendarWidth = Math.min(width - 40, 400);

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: 'center',
            alignItems: 'center',
        },
        calendarCard: {
            width: calendarWidth,
            maxWidth: 400,
        },
        calendarContent: {
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        navButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            overflow: 'hidden',
        },
        navButtonText: {
            fontSize: 24,
            color: '#fff',
            fontWeight: 'bold',
        },
        monthYear: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        dayNamesRow: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        dayNameCell: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
        },
        dayNameText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        calendarGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        dayCell: {
            width: `${100 / 7}%`,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
        },
        selectedDay: {
            borderRadius: 8,
            overflow: 'hidden',
        },
        todayDay: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
            borderRadius: 8,
        },
        dayText: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: '500',
        },
        disabledDayText: {
            color: theme.colors.textTertiary,
        },
        selectedDayText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        todayDayText: {
            color: theme.colors.primary,
            fontWeight: 'bold',
        },
        closeButton: {
            marginTop: 20,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
        },
        closeButtonGradient: {
            padding: 12,
            alignItems: 'center',
        },
        closeButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: '600',
        },
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <GlassCard style={styles.calendarCard} intensity="strong">
                        <View style={styles.calendarContent}>
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity
                                    onPress={handlePreviousMonth}
                                >
                                    <LinearGradient
                                        colors={theme.gradients.primary as any}
                                        style={styles.navButton}
                                    >
                                        <Text style={styles.navButtonText}>←</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <Text style={styles.monthYear}>
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </Text>

                                <TouchableOpacity
                                    onPress={handleNextMonth}
                                >
                                    <LinearGradient
                                        colors={theme.gradients.primary as any}
                                        style={styles.navButton}
                                    >
                                        <Text style={styles.navButtonText}>→</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            {/* Day names */}
                            <View style={styles.dayNamesRow}>
                                {dayNames.map((day) => (
                                    <View key={day} style={styles.dayNameCell}>
                                        <Text style={styles.dayNameText}>{day}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Calendar grid */}
                            <View style={styles.calendarGrid}>
                                {calendarDays.map((day, index) => {
                                    const disabled = isDateDisabled(day);
                                    const selected = isDateSelected(day);
                                    const today = isToday(day);

                                    if (selected && day !== null) {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dayCell}
                                                onPress={() => day && !disabled && handleDateSelect(day)}
                                                disabled={disabled || day === null}
                                            >
                                                <LinearGradient
                                                    colors={theme.gradients.primary as any}
                                                    style={styles.selectedDay}
                                                >
                                                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.selectedDayText}>{day}</Text>
                                                    </View>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        );
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.dayCell,
                                                today && !selected && styles.todayDay,
                                            ]}
                                            onPress={() => day && !disabled && handleDateSelect(day)}
                                            disabled={disabled || day === null}
                                        >
                                            {day !== null && (
                                                <Text
                                                    style={[
                                                        styles.dayText,
                                                        disabled && styles.disabledDayText,
                                                        today && !selected && styles.todayDayText,
                                                    ]}
                                                >
                                                    {day}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Close button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <LinearGradient
                                    colors={theme.gradients.secondary as any}
                                    style={styles.closeButtonGradient}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CalendarPicker;
