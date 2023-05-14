module.exports = {
  title: 'Praxis',
  tagline: 'The tagline of my site',
  url: 'https://www.praxis-framework.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'praxis', // Usually your GitHub org/user name.
  projectName: 'praxis', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Praxis',
      logo: {
        alt: 'Praxis Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/gettingStarted/intro',
          activeBasePath: 'docs',
          label: 'Getting Started',
          position: 'right',
        },
        {
          to: 'docs/reference/intro',
          activeBasePath: 'docs',
          label: 'Reference',
          position: 'right',
        },
        {
          href: 'https://github.com/praxis/praxis',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    docs: {
      sidebar: {
        hideable: true
      }
    },
    prism: {
      additionalLanguages: ['ruby'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true,
        },
      },
    ],
  ],
};
