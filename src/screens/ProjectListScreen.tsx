import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { Screen } from '../components/Screen';
import { SectionHeading } from '../components/SectionHeading';
import { projects } from '../data/portfolio';
import { ProjectsStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/colors';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectList'>;

export function ProjectListScreen({ navigation }: Props) {
  return (
    <Screen>
      <SectionHeading eyebrow="Work" title="Projects" />
      <Text style={styles.lead}>Two projects. Open one for the problem, the contribution, and the stack.</Text>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" detail="Add a project with a title, problem, contribution, and technology." />
      ) : (
        <View style={styles.list}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              index={index}
              title={project.title}
              year={project.year}
              technology={project.technology}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
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
});
