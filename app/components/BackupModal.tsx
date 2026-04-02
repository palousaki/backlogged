import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors } from '../theme'

type Props = {
  visible: boolean
  onClose: () => void
  onExport: () => void
  onImport: () => void
}

export default function BackupModal({ visible, onClose, onExport, onImport }: Props) {
  const colors = useColors()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { backgroundColor: colors.card }]}>
              <Text style={[styles.title, { color: colors.muted }]}>Backup</Text>

              <TouchableOpacity
                style={[styles.option, { backgroundColor: colors.cardBorder }]}
                onPress={() => { onExport(); onClose() }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrap, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="arrow-up-circle-outline" size={22} color={colors.accent} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>Export library</Text>
                  <Text style={[styles.optionSub, { color: colors.muted }]}>Save a backup file to your device</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, { backgroundColor: colors.cardBorder }]}
                onPress={() => { onImport(); onClose() }}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrap, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="arrow-down-circle-outline" size={22} color={colors.accent} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>Import library</Text>
                  <Text style={[styles.optionSub, { color: colors.muted }]}>Restore from a backup file</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.cardBorder }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, { color: colors.muted }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    gap: 2,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionSub: {
    fontSize: 12,
  },
  cancelBtn: {
    marginTop: 4,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
})
