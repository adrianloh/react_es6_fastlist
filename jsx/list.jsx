import React from 'react';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

class List extends React.Component {

	constructor() {
		super();
		this.state = {
			sortBy: "",
			predicate: "",
			reversed: true,
			page: 1
		};
		this.DOMNodes = {};
		this.setPredicate = debounce(this._setPredicate, 150);
		this.buttonFuncs = {};
		this.perPage = 1000;
		this.filterBy = "";
	}

	compareBy(a, b) {
		var field = this.state.sortBy,
			reversed = this.state.reversed,
			x = reversed ? b[field] : a[field],
			y = reversed ? a[field] : b[field];
		if (x > y) {
			return 1;
		}
		if (x < y) {
			return -1;
		}
		return 0;
	}

	slower_compareBy(a, b) {
		var field = this.state.sortBy,
			reversed = this.state.reversed,
			x = reversed ? b[field] : a[field],
			y = reversed ? a[field] : b[field];
		if (typeof(x)==='string') {
			x = x.toLowerCase();
			y = y.toLowerCase();
			return x.localeCompare(y);
		} else {
			if (x > y) {
				return 1;
			}
			if (x < y) {
				return -1;
			}
			return 0;
		}
	}

	_setPredicate(e) {
		this.setState({
			page: 1,
			predicate: e.target.value
		});
	}

	_setSortBy(field) {
		return () => {
			if (this.state.sortBy === field) {
				this.setState({
					page: 1,
					reversed: !this.state.reversed});
			} else {
				this.setState({
					page: 1,
					sortBy: field
				})
			}
		}
	}

	componentWillReceiveProps(props) {

		this.filterBy = props.filterBy;

		var keys = Object.keys(props.items[0])
			.filter(k => {
				return k.match(/^[A-Z]/)
			}).sort();

		this.buttonFuncs = keys.reduce((h, k) => {
			h[k] = this._setSortBy(k);
			return h;
		}, {});

		this.buttonFuncs['Reverse'] = () => {
			this.setState({
				page: 1,
				reversed: !this.state.reversed})
		};

		this.buttonFuncs['More'] = () => {
			this.setState({
				page: this.state.page + 1
			})
		};

		props.items.forEach(item => {
			this.DOMNodes[item.id] = <ListItem key={item.id} item={item} />
		});

		this.setState({sortBy: keys[0]});

	}

	render() {
		var regex = new RegExp(this.state.predicate, "i");
		var l = this.state.predicate.length;
		return (
			<div>
				<div>
					<ActionButtons buttonActions={this.buttonFuncs} />
					<SearchBox setPredicate={this.setPredicate.bind(this)} />
				</div>
				<table>
					<tbody>
					{this.props.items
						.filter(item => {
							return l > 0 ? item[this.filterBy].match(regex) : true
						})
						.sort(this.compareBy.bind(this))
						.slice(0, this.perPage * this.state.page)
						.map(item => {
							return this.DOMNodes[item.id]
						})
						}
					</tbody>
				</table>
			</div>
		);
	}

}

class ListItem extends React.Component {

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return(
			<tr>
				{Object.keys(this.props.item).filter(k => {
						return k.match(/^[A-Z]/)
					}).map(k => {
						return <th key={k}>{this.props.item[k]}</th>
					})}
			</tr>
		)
	}
}

class ActionButtons extends React.Component {
	render() {
		return(
			<div>{Object.keys(this.props.buttonActions).map(k => {
					return <button key={k} onClick={this.props.buttonActions[k]}>{k}</button>
				})
				}
			</div>
		)
	}
}

class SearchBox extends React.Component {
	render() {
		return(
			<input onChange={this.props.setPredicate} />
		)
	}
}

export default List;