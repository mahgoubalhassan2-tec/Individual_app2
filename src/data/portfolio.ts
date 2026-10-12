export type Skill = {
  id: string;
  name: string;
  detail: string;
};

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  detail: string;
};

export type Project = {
  id: string;
  title: string;
  problem: string;
  contribution: string;
  technology: string;
  year: string;
};

export const skills: Skill[] = [
  {
    id: 'python',
    name: 'Python',
    detail: 'Scripts that read input, automate a repeated task, and print a clear result.',
  },
  {
    id: 'automation',
    name: 'Automation',
    detail: 'Turning a manual sequence into a script that can be run the same way again.',
  },
  {
    id: 'cloud',
    name: 'Cloud engineering',
    detail: 'Preparing a service so it can run on a cloud platform instead of one local machine.',
  },
  {
    id: 'linux',
    name: 'Linux',
    detail: 'The shell, files, and processes used to run automation and inspect a host.',
  },
  {
    id: 'git',
    name: 'Git',
    detail: 'Commits and history so a script or cloud setup can be changed without losing the last working version.',
  },
  {
    id: 'scripting',
    name: 'Scripting',
    detail: 'Small tools that collect input, do the work, and report what happened.',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    detail: 'The servers, configuration, and environment a cloud service needs before it can start.',
  },
];

export const education: EducationItem[] = [
  {
    id: 'ines',
    period: 'September 2024 onward',
    title: 'INES-Ruhengeri',
    detail: 'Software Engineering. Registration number 25/28013.',
  },
];

export const projects: Project[] = [
  {
    id: 'python-automation',
    title: 'Python automation scripts',
    year: '2026 · Automation',
    problem:
      'Repeated checks and file tasks were done by hand, so the same steps were easy to skip or mistype.',
    contribution:
      'I wrote Python scripts that run those steps in order, read the input, and print a clear result when a step fails.',
    technology: 'Python and automation',
  },
  {
    id: 'cloud-setup',
    title: 'Cloud environment setup',
    year: '2026 · Cloud',
    problem:
      'A small service needed a repeatable place to run, instead of a machine set up once by hand.',
    contribution:
      'I prepared the cloud environment, checked that the service started, and kept the steps in Git so the setup can be repeated.',
    technology: 'Cloud engineering and Git',
  },
];

export const contactLinks: readonly { label: string; url: string }[] = [];
