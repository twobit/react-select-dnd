import React from 'react';
import Select from './Select';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';

const itemSource = {
  beginDrag(props) {
    return props.value;
  }
};

const itemTarget = {
  hover(props, monitor) {
    const item = monitor.getItem();
    if (item !== props.value) {
      props.onChangeLayout(item, props.value);
    }
  }
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectDrop(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

var DraggableValue = function(Component) {
  return (
    DragSource("DraggableSelect", itemSource, collectDrag)(
    DropTarget("DraggableSelect", itemTarget, collectDrop)(
      React.createClass({
        render() {
          const {connectDragSource, connectDropTarget, isDragging, ...rest} = this.props;
          return connectDragSource(connectDropTarget(
            <span style={{opacity: isDragging ? 0.3 : null}}
                  onMouseDown={e => e.stopPropagation()}>
                    <Component {...rest} />
            </span>
          ));
        }
      })
    ))
  );
};

var DraggableSelect = function(Component, ValueComponent) {
  return React.createClass({
  	getDefaultProps () {
  		return {
			  valueKey: 'value'
      };
    },

    onChangeLayout(src, dest) {
      const {value, valueKey, onChange} = this.props,
            values = value.map(d => d[valueKey]),
            srcIndex = values.indexOf(src[valueKey]),
            destIndex = values.indexOf(dest[valueKey]),
            newValue = value.concat([]);

      newValue.splice(srcIndex, 1);
      newValue.splice(destIndex, 0, src);
      onChange(newValue);
    },

  	render() {
  		return (
  			<Component {...this.props}
  				multi={true}
          onChangeLayout={this.onChangeLayout}
          valueComponent={ValueComponent} />
  		);
  	}
  });
};

export {DraggableSelect, DraggableValue};

class SelectDND extends Select {
	constructor(props) {
		super(props);
		this.renderValue = this._renderValue.bind(this);
		this.onChangeLayout = this._onChangeLayout.bind(this);
	}

  _onChangeLayout(src, dest) {
    const {value, valueKey, onChange} = this.props,
          values = value.map(d => d[valueKey]),
          srcIndex = values.indexOf(src[valueKey]),
          destIndex = values.indexOf(dest[valueKey]),
          newValue = value.concat([]);

    newValue.splice(srcIndex, 1);
    newValue.splice(destIndex, 0, src);
    onChange(newValue);
  }

	_renderValue(valueArray, isOpen) {
		let renderLabel = this.props.valueRenderer || this.getOptionLabel;
		let ValueComponent = DraggableValue(this.props.valueComponent);
		if (!valueArray.length) {
			return !this.state.inputValue ? <div className="Select-placeholder">{this.props.placeholder}</div> : null;
		}
		let onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map((value, i) => {
				return (
					<ValueComponent
            onChangeLayout={this.onChangeLayout}
						id={this._instancePrefix + '-value-' + i}
						instancePrefix={this._instancePrefix}
						disabled={this.props.disabled || value.clearableValue === false}
						key={`value-${i}-${value[this.props.valueKey]}`}
						onClick={onClick}
						onRemove={this.removeValue}
						value={value}
					>
						{renderLabel(value)}
						<span className="Select-aria-only">&nbsp;</span>
					</ValueComponent>
				);
			});
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return (
				<ValueComponent
					id={this._instancePrefix + '-value-item'}
					disabled={this.props.disabled}
					instancePrefix={this._instancePrefix}
					onClick={onClick}
					value={valueArray[0]}
				>
					{renderLabel(valueArray[0])}
				</ValueComponent>
			);
		}
	}
}

const SelectDNDBackend = DragDropContext(HTML5Backend)(SelectDND);

export {SelectDND, SelectDNDBackend};
