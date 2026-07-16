import { TopicFamily, Level } from '@/types';

export const topicFamilyMeta: Record<TopicFamily, {
  id: TopicFamily;
  name: string;
  description: string;
  icon: string;
  order: number;
}> = {
  'foundations': {
    id: 'foundations',
    name: 'Web & JavaScript Foundations',
    description: 'Modules, closures, async JS, promises, immutability, DOM basics, and TypeScript essentials — everything React builds on.',
    icon: '01',
    order: 1,
  },
  'react-mental-model': {
    id: 'react-mental-model',
    name: 'React Mental Model',
    description: 'Components, JSX, rendering, props, state, events, conditional rendering, lists, keys, composition, and one-way data flow.',
    icon: '02',
    order: 2,
  },
  'state-behavior': {
    id: 'state-behavior',
    name: 'State & Behavior',
    description: 'Controlled inputs, lifting state, reducers, context, refs, effects, custom hooks, and effect anti-patterns.',
    icon: '03',
    order: 3,
  },
  'app-quality': {
    id: 'app-quality',
    name: 'Application Quality',
    description: 'Forms, validation, accessibility, error boundaries, loading states, optimistic UI, testing, debugging, and maintainable component design.',
    icon: '04',
    order: 4,
  },
  'nextjs-foundations': {
    id: 'nextjs-foundations',
    name: 'Next.js Foundations',
    description: 'Project structure, App Router, layouts, pages, navigation, route segments, loading UI, error UI, metadata, assets, and configuration.',
    icon: '05',
    order: 5,
  },
  'rsc-client': {
    id: 'rsc-client',
    name: 'React Server Components',
    description: 'RSC boundaries, serializable props, when to use Server vs Client Components, data-fetching implications, and common mistakes.',
    icon: '06',
    order: 6,
  },
  'nextjs-data': {
    id: 'nextjs-data',
    name: 'Next.js Data Work',
    description: 'Server-side data fetching, caching, revalidation, mutations, route handlers, server actions, request states, and cache invalidation.',
    icon: '07',
    order: 7,
  },
  'production': {
    id: 'production',
    name: 'Production Concerns',
    description: 'Authentication and authorization concepts, security boundaries, environment variables, performance, images, fonts, SEO, observability, and deployment.',
    icon: '08',
    order: 8,
  },
  'architecture': {
    id: 'architecture',
    name: 'Architecture & Decision-Making',
    description: 'Feature organization, state ownership, server/client responsibility, API boundaries, dependency choices, migration strategy, and technical trade-offs.',
    icon: '09',
    order: 9,
  },
};

export const prerequisitePaths: Record<Level, TopicFamily[]> = {
  'beginner': ['foundations', 'react-mental-model', 'state-behavior', 'app-quality', 'nextjs-foundations'],
  'intermediate': ['react-mental-model', 'state-behavior', 'nextjs-foundations', 'rsc-client', 'nextjs-data'],
  'advanced': ['state-behavior', 'nextjs-data', 'rsc-client', 'production', 'architecture'],
  'expert': ['nextjs-data', 'production', 'architecture'],
};
