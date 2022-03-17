import React, { Component } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import Header from 'parts/Header';
import Home from 'pages/Home';

class Main extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <HashRouter>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default Main;
