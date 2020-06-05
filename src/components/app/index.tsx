import React from "react";
import { HashRouter, Switch, Route, Link, useLocation } from "react-router-dom";

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
      {pages.map(({ path, title }, i) =>
        pathname === path ? (
          <div>{title}</div>
        ) : (
          <Link to={path} key={i}>
            {title}
          </Link>
        )
      )}
    </nav>
  );
};

export const App: React.FC = () => {
  const pages: Page[] = [
    {
      path: "/pvp",
      Component: Pvp,
      title: "Against Yourself",
    },
    {
      path: "/pva",
      Component: Pva,
      title: "Against AI",
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
        <HashRouter>
          <h1>
            <Link to="/">tic tac toe</Link>
          </h1>
          <Nav pages={pages} />
          <Switch>
            <Route path="/" exact>
              <p>
                Welcome to my little tic tac toe game. The purpose of this
                project was to get familiar with the development of machine
                learning algorithms in tensorflow.js. On this website you can
                either play against <Link to="/pvp">yourself</Link> or against a
                very simple machine learning <Link to="/pva">algorithm</Link>.
                If you want, you can even <Link to="/training">train</Link> your
                own tensorflow model and download it. The source code is
                available{" "}
                <a
                  href="https://github.com/paulkre/tic-tac-toe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </p>
              <p className={styles.signature}>
                —
                <br />
                Paul Kretschel
              </p>
            </Route>
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
        </HashRouter>
      </div>
      <GithubLink />
    </div>
  );
};
