import { StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { SectionHeading } from '../components/SectionHeading';
import { SkillCard } from '../components/SkillCard';
import { TimelineItem } from '../components/TimelineItem';
import { education, skills } from '../data/portfolio';
import { colors, spacing } from '../theme/colors';

export function SkillsScreen() {
  return (
    <Screen>
      <SectionHeading eyebrow="Stack" title="Skills" />
      <Text style={styles.lead}>
        These are the automation, Python, and cloud skills in this portfolio.
      </Text>
      {skills.length === 0 ? (
        <EmptyState title="No skills yet" detail="Add at least five skills in the portfolio data." />
      ) : (
        <View style={styles.list}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} name={skill.name} detail={skill.detail} />
          ))}
        </View>
      )}
      <Text style={styles.section}>Education and training</Text>
      {education.length === 0 ? (
        <EmptyState title="No education yet" detail="Add a short training timeline." />
      ) : (
        <View style={styles.timeline}>
          {education.map((item, index) => (
            <TimelineItem
              key={item.id}
              period={item.period}
              title={item.title}
              detail={item.detail}
              isLast={index === education.length - 1}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: spacing.sm,
  },
  section: {
    marginTop: spacing.sm,
    color: colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  timeline: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
});
