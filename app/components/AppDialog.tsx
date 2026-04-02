import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useColors } from '../theme'

type DialogButton = {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive' | 'primary'
}

type Props = {
  visible: boolean
  title: string
  message: string
  buttons?: DialogButton[]
  onDismiss: () => void
}

export default function AppDialog({ visible, title, message, buttons, onDismiss }: Props) {
  const colors = useColors()

  const resolvedButtons: DialogButton[] = buttons ?? [{ label: 'OK', onPress: onDismiss, variant: 'primary' }]

  const buttonBg = (variant: DialogButton['variant']) => {
    if (variant === 'destructive') return colors.status.dropped
    if (variant === 'primary') return colors.accent
    return colors.cardBorder
  }

  const buttonTextColor = (variant: DialogButton['variant']) => {
    if (variant === 'destructive' || variant === 'primary') return '#FFFFFF'
    return colors.text
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
          <View style={[styles.actions, resolvedButtons.length === 1 && styles.actionsCenter]}>
            {resolvedButtons.map((btn) => (
              <TouchableOpacity
                key={btn.label}
                style={[styles.btn, { backgroundColor: buttonBg(btn.variant) }, resolvedButtons.length === 1 && styles.btnSingle]}
                onPress={btn.onPress}
                activeOpacity={0.7}
              >
                <Text style={[styles.btnText, { color: buttonTextColor(btn.variant) }]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionsCenter: {
    justifyContent: 'flex-end',
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSingle: {
    flex: 0,
    paddingHorizontal: 24,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
  },
})
