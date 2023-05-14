import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { text } from '@fortawesome/fontawesome-svg-core';

const FAQs = [
  {
    title: "Can I use it in my existing Rails App?",
    text: "You Bet! For already existing ruby apps like Rails, you can embed it seamlessly as a Praxis middleware, and take advantage of sharing any existing models and business logic that you have written. It is the perfect way to quickly build an API for your already existing app."
  },
  {
    title: "Is it GraphQL compatible?",
    text: "Not exactly, a Praxis app will not act as a full GraphQL server as it is still a RESTful API. However, any listing action can natively support the normal GraphQL syntax for defining which fields and nested subresource fields to return within a single API call. In other words, it supports one of the most desired and used features of GraphQL itself, while still enjoying the many advantages and simplicity of a RESTful design."
  },
]
function SingleFAQ({ title, text }) {
  return (
    <div className={clsx('col col--6')}>
      <div className={styles.how}>
        <h3 className={styles.title}>
          <FontAwesomeIcon icon="fa fa-question-circle" style={{ color: '#606470', paddingRight: '10px' }} />
          {title}
        </h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function HomepageFAQ() {
  return (
    <>
      <div className={clsx('col col--12')}>
        <h2 className={styles.sectionTitle} >
          Frequently Asked Questions
        </h2>
      </div>
      <section className={styles.sectionRow} >
        <div className="row" style={{ width: '85%', alignItems: 'center' }}>
          {FAQs.map(({ title, text }) => (<SingleFAQ title={title} text={text} />))}
        </div>

      </section>
    </>
  );
}
