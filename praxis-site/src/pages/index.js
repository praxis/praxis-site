import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageBatteriesIncludedSection from '@site/src/components/HomepageBatteriesIncludedSection';
import HomepageGettingThisSection from '@site/src/components/HomepageGettingThisSection';
import HomepageFAQ from '@site/src/components/HomepageFAQ';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeSvgIcon } from 'react-fontawesome-svg-icon';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component.
// import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons.
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons.
import styles from './index.module.css';

library.add(fas); // Add all icons to the library so you can use them without importing them individually.

function Description() {
  return (
    <section className={styles.descriptionRow} >
      <div className={clsx('col col--8')}>
        <div className="text--center padding-horiz--md">
          <p>Praxis is a light and extensible Ruby framework that allows you to design and create preformant REST APIs at unprecedented speed.</p>
        </div>
      </div >
    </section>
  )
}
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <faBookOpen.svg> Hello</faBookOpen.svg>. */}
        {/* <FontAwesomeIcon icon="fa fa-book-open" /> */}
        {/* <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <Description />
        <HomepageFeatures />
        <HomepageBatteriesIncludedSection />
        <HomepageGettingThisSection />
        <HomepageFAQ />
      </main>
    </Layout>
  );
}
