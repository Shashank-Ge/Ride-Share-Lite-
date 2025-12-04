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

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add all days of the month
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

        // Check if date is before minimum date
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
                    <View style={styles.calendarContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={handlePreviousMonth}
                                style={styles.navButton}
                            >
                                <Text style={styles.navButtonText}>←</Text>
                            </TouchableOpacity>

                            <Text style={styles.monthYear}>
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </Text>

                            <TouchableOpacity
                                onPress={handleNextMonth}
                                style={styles.navButton}
                            >
                                <Text style={styles.navButtonText}>→</Text>
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

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dayCell,
                                            selected && styles.selectedDay,
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
                                                    selected && styles.selectedDayText,
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
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const { width } = Dimensions.get('window');
const calendarWidth = Math.min(width - 40, 400);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: calendarWidth,
        maxWidth: 400,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            },
        }),
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
        backgroundColor: '#f0f0f0',
    },
    navButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    monthYear: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#666',
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
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    todayDay: {
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 8,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    disabledDayText: {
        color: '#ccc',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    todayDayText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
});

export default CalendarPicker;
