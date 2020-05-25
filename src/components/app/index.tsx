import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import styles from "./app.module.scss";
import { Pvp } from "./pvp";
import { Pva } from "./pva";
import { Training } from "./training";

type Page = {
  path: string;
  Component: React.FC;
  title: string;
};

export const App: React.FC = () => {
  const pages: Page[] = [
    {
      path: "/pva",
      Component: Pva,
      title: "Human vs AI",
    },
    {
      path: "/pvp",
      Component: Pvp,
      title: "Human vs Human",
    },
    {
      path: "/training",
      Component: Training,
      title: "Training",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Router>
        <h1>
          <Link to="/">tic tac toe</Link>
        </h1>
        <nav className={styles.nav}>
          {pages.map(({ path, title }, i) => (
            <Link to={path} key={i}>
              {title}
            </Link>
          ))}
        </nav>
        <Switch>
          <Route path="/" exact>
            <Pvp />
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
      </Router>
      {/* <PvaGame id={gameId} onFinish={handleFinish} /> */}
    </div>
  );
};
