import ReactDOM from 'react-dom';
import React from 'react';
import Reqwest from 'reqwest';
import List from './list'

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			library: []
		};
		Reqwest('/library.json', resp => {
			this.setState({library: resp})
		})
	}

	render() {
		return <List items={this.state.library} filterBy="_all" />
	}

}

ReactDOM.render(<App />, document.getElementById("target"));