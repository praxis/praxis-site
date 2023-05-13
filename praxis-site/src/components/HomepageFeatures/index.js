import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.

const FeatureList = [
  {
    title: 'Truthful & Beautiful Docs',
    icon: "fa fa-book-open",
    description: (
      <>
        Automatically generate Open API 3.x documents from the actual functioning code,
        and rest assured they're always correct.
      </>
    ),
  },
  {
    title: 'GraphQL Flexibility, REST Simplicity',
    icon: "fa fa-lightbulb",
    description: (
      <>
        Allow customers to specify which fields they want to receive using the GraphQL syntax,
        but exposing them through well known REST endpoints.
      </>
    ),
  },
  {
    title: 'Fast Runtime, Blazing Fast Development',
    icon: "fa fa-rocket",
    description: (
      <>
        Deploy your API using one of the best Ruby performing frameworks
        and take advantage of an unprecedented development speed.
      </>
    ),
  },
  {
    title: 'API Design-First Philosophy',
    icon: 'fa fa-drafting-compass',
    description: (
      <>
        Craft and visualize your API design upfont, without writing a single line of code.
        Forget about implementing API validations, the framework fully takes care
        of it from your design specs.
      </>
    ),
  },
  {
    title: 'Feature Rich and Fully Customizable',
    icon: "fa fa-cogs",
    description: (
      <>
        Take advantage of best practices, proven methods, standards
        and features that the frameworks comes with, or pick and choose only the ones you want to enable.
      </>
    ),
  },
  {
    title: 'Hardnened & Battle Tested',
    icon: 'fa fa-shield-virus',
    description: (
      <>
        Rest assured you'll get the advertised results as this framework has been deployed in production environments since before 2014.
      </>
    ),
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIconBorder}>
          <FontAwesomeIcon icon={icon} className={styles.featureIcon} />
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div >
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="row">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
