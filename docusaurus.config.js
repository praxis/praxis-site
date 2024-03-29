// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');
// nightOwl
// palenight

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Praxis',
  tagline: 'Meaner. Better. Faster. Stronger.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://site.praxis-framework.io', //'http:/praxis-framework.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'praxis', // Usually your GitHub org/user name.
  projectName: 'praxis-site', // 'praxis', // Usually your repo name.
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Praxis',
        logo: {
          alt: 'Praxis Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'gettingStarted/intro',
            position: 'right',
            label: 'Getting Started',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/praxis/praxis',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/gettingStarted/intro',
              },
              {
                label: 'API Reference',
                to: '/docs/Reference/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Slack',
                href: 'https://praxis-framework.slack.com/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/praxis/praxis',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Praxis. Built with Docusaurus.`,
      },
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['ruby'],
      },
    }),
};

module.exports = config;
