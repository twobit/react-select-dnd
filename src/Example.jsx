import React from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {SelectDND} from './Draggable';

const OPTIONS = [
	{key: 10, title: 'Ten'},
	{key: 11, title: 'Eleven'},
	{key: 12, title: 'Twelve'},
	{key: 23, title: 'Twenty-three'},
	{key: 24, title: 'Twenty-four'}
];

class Example extends React.Component {
	constructor(props) {
		super(props);
    this.state = {value: null};
	}

  onChange = value => {
    this.setState({value});
    console.log('Select value changed to', value);
  };

	render() {
		return (
      <div style={{width: 300}}>
        <SelectDND valueKey="key"
                labelKey="title"
                onChange={this.onChange}
                value={this.state.value}
                options={OPTIONS}
                multi={true} />
      </div>
		);
	}
}

const DraggableExample = DragDropContext(HTML5Backend)(class extends React.Component {
	render() {
		return (
			<div>
				<Example />
				<Example />
			</div>
		);
	}
});

ReactDOM.render(
	<DraggableExample />,
	document.getElementById('root')
);
