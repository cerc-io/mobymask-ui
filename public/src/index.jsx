import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const themes = {
  dark: `${process?.env?.PUBLIC_URL}/dark-theme.css`,
  light: `${process?.env?.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const watcherUri = process?.env?.REACT_APP_WATCHER_URI;

const client = new ApolloClient({
  uri: watcherUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <App />
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
