import {defineConfig} from 'vitepress';
import {apiSidebarConfig} from './gen-api-sidebar';

const CORE_PACKAGES = ['project-builder', 'project-config'];
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'SQLRooms',
  description: 'Build powerful analytics apps with DuckDB in browser',
  base: '/',
  head: [
    ['link', {rel: 'icon', href: '/logo.png'}],
    [
      'meta',
      {
        name: 'google-site-verification',
        content: 'x-FE_DDWM1BS8Eu4JOG0el7pL1gWJgIM-fwFl2EG4OU',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Overview', link: '/overview'},
      {text: 'Get started', link: '/getting-started'},
      {text: 'Reference', link: '/packages'},
      {text: 'Examples', link: '/examples'},
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'Overview',
            link: '/overview',
          },
          {
            text: 'Getting started',
            link: '/getting-started',
          },
        ],
      },
      {
        text: 'Reference',
        items: [
          {
            text: 'Core Packages',
            link: '/packages#core-packages',
            items: apiSidebarConfig.filter((item) =>
              CORE_PACKAGES.includes(item.text),
            ),
          },
          {
            text: 'Feature Packages',
            link: '/packages#feature-packages',
            items: apiSidebarConfig.filter(
              (item) => !CORE_PACKAGES.includes(item.text),
            ),
          },
        ],
      },
      {
        text: 'Examples',
        items: [
          {
            text: 'Examples Overview',
            link: '/examples',
            items: [
              {
                text: 'Basic Example (Vite)',
                link: '/examples/#mosaic-example-vite',
              },
              {
                text: 'AI Analytics (Next.js)',
                link: '/examples#ai-powered-analytics-next-js',
              },
            ],
          },
        ],
      },
      {
        text: 'Case Studies',
        items: [
          {
            text: 'Flowmap City',
            link: '/case-studies#flowmap-city',
          },
          {
            text: 'Cosmograph',
            link: '/case-studies#cosmograph',
          },
        ],
      },
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/sqlrooms/sqlrooms'},
    ],
  },
});
