import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.

const rackupCode = `\
$ gem install praxis
$ praxis example myapi && cd myapi
$ rackup -p 9292
`;
const curlCode = `\
$ curl http://localhost:9292/something/here
`;

export default function HomepageGettingThisSection() {
  return (
    <>
      <section className={styles.sectionRow} >
        <div className="row" style={{ width: '85%', alignItems: 'center' }}>
          <div className={clsx('col col--6')}>
            <CodeBlock language='shell'>
              {rackupCode}
            </CodeBlock>
            <div className="summary" >
              And access the API from another terminal or using your favorite tool:
            </div>
            <CodeBlock language='shell'>
              {curlCode}
            </CodeBlock>
          </div>
          <div className={clsx('col col--6')} style={{ paddingLeft: '40px' }}>
            <h2 className={styles.title}>
              How can I get all this?
            </h2>
            <p>
              Glad you asked! Get the Praxis gem, maybe start by generating and playing with a simple pre-canned example app, and read the official documentation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
