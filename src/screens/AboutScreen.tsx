import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { FramedImage } from '../components/FramedImage';
import { Screen } from '../components/Screen';
import { SectionHeading } from '../components/SectionHeading';
import { useProfile } from '../context/ProfileContext';
import { dataUseStatement, student } from '../data/identity';
import { contactLinks } from '../data/portfolio';
import { colors, spacing } from '../theme/colors';

export function AboutScreen() {
  const { profile } = useProfile();

  return (
    <Screen>
      <SectionHeading eyebrow="Release" title="About" />
      <InfoRow label="App name" value={student.appName} />
      <InfoRow label="Student" value={student.fullName} />
      <InfoRow label="Registration number" value={student.registrationNumber} />
      <InfoRow label="Verification code" value={student.verificationCode} />
      <InfoRow label="Version" value={student.version} />
      <InfoRow label="Android package" value={student.packageName} />
      <View style={styles.statement}>
        <Text style={styles.label}>Data use</Text>
        <Text style={styles.body}>{dataUseStatement}</Text>
      </View>
      <View style={styles.cardPreview}>
        <Text style={styles.label}>Verification card preview</Text>
        {profile.verificationCardUri ? (
          <FramedImage
            source={{ uri: profile.verificationCardUri }}
            aspectRatio={4 / 3}
            label="Verification card image preview"
          />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.code}>{student.verificationCode}</Text>
            <Text style={styles.emptyText}>
              No card photo yet. On the Profile tab, capture the handwritten card to preview it here.
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.contactTitle}>Contact</Text>
      <Text style={styles.contactLead}>
        No external contact links are included. The profile, skills, and projects stay available offline.
      </Text>
      {contactLinks.map((link) => (
        <Pressable
          key={link.url}
          style={styles.link}
          onPress={() => Linking.openURL(link.url)}
          accessibilityRole="link"
          accessibilityLabel={`Needs a connection. Open ${link.label}.`}
        >
          <Text style={styles.linkFlag}>Needs a connection</Text>
          <Text style={styles.linkText}>{link.label}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  label: {
    color: colors.terracotta,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  statement: {
    backgroundColor: colors.oliveSoft,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  cardPreview: {
    gap: spacing.sm,
  },
  emptyCard: {
    borderRadius: 16,
    backgroundColor: colors.deep,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  code: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.md,
    justifyContent: 'center',
    gap: 4,
  },
  linkFlag: {
    color: colors.terracotta,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  contactTitle: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  contactLead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
});
