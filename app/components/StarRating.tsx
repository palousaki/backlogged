import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
  rating: number          // 0–5
  onRate?: (value: number) => void
  size?: number
  readonly?: boolean
}

export default function StarRating({ rating, onRate, size = 20, readonly = false }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating
        if (readonly) {
          return (
            <Text
              key={star}
              style={[styles.star, { fontSize: size, color: filled ? '#FDCB6E' : '#B2BEC3' }]}
            >
              ★
            </Text>
          )
        }
        return (
          <TouchableOpacity
            key={star}
            onPress={() => onRate?.(star === rating ? 0 : star)}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          >
            <Text
              style={[styles.star, { fontSize: size, color: filled ? '#FDCB6E' : '#B2BEC3' }]}
            >
              ★
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    lineHeight: undefined,
  },
})
