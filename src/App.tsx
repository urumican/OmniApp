import * as React from 'react';
import Container from './components/Container'
import './App.css';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Container />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);