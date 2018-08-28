import React from 'react';
import Tetrahedron from './Tetrahedron';

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  
  resize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
  componentDidMount() {
    window.addEventListener('resize', debounce(this.resize, 200));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.resize, 200));
  }

  render () {
    const {width, height} = this.state;
    return (
      <div className="app">
        <div className="row">
          <Tetrahedron id={1} width={width/5} height={height/5} />
          <Tetrahedron id={2} width={width/5} height={height/5} />
          <Tetrahedron id={3} width={width/5} height={height/5} />
          <Tetrahedron id={4} width={width/5} height={height/5} />
          <Tetrahedron id={5} width={width/5} height={height/5} />
        </div>
      </div>
    );
  }
}

export default App;
