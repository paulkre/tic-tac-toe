import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import styles from "./app.module.scss";
import { Pvp } from "./pvp";
import { Pva } from "./pva";
import { Training } from "./training";
import { GithubLink } from "./gh-link";

type Page = {
  path: string;
  Component: React.FC;
  title: string;
};

const Nav: React.FC<{ pages: Page[] }> = ({ pages }) => {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav}>
      {pages.map(({ path, title }, i) => (
        <Link
          to={path}
          className={pathname === path ? styles.activeLink : undefined}
          key={i}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
};

export const App: React.FC = () => {
  const pages: Page[] = [
    {
      path: "/pva",
      Component: Pva,
      title: "Against AI",
    },
    {
      path: "/pvp",
      Component: Pvp,
      title: "Against Yourself",
    },
    {
      path: "/training",
      Component: Training,
      title: "Training",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Router basename={process.env.PUBLIC_URL}>
          <h1>
            <Link to="/">tic tac toe</Link>
          </h1>
          <Nav pages={pages} />
          <Switch>
            <Route path="/" exact component={Pva} />
            {pages.map(({ path, Component, title }, i) => (
              <Route path={path} key={i}>
                <h2>{title}</h2>
                <Component />
              </Route>
            ))}
            <Route>
              <h2>404</h2>
              <p>Page not found. :(</p>
            </Route>
          </Switch>
        </Router>
      </div>
      <GithubLink />
    </div>
  );
};
