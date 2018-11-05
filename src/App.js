import './app.css';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Header from './components/header';
import Stories from './components/stories';

const App = () => (
  <React.Fragment>
    <Header />
    <Stories />
  </React.Fragment>
);

export default App;
