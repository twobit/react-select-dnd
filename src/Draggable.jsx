import React from 'react';
import Select from 'react-select';
import {DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';

const itemSource = {
  beginDrag({id, value}) {
    return {id, value};
  }
};

const itemTarget = {
  hover({id, value, onChangeLayout}, monitor) {
    const item = monitor.getItem();
    if (item.id !== id) {
      onChangeLayout(item.value, value);
    }
  }
};

const collectDrag = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const collectDrop = connect => ({
  connectDropTarget: connect.dropTarget()
});

const DraggableValue = Component =>
  DragSource("DraggableSelect", itemSource, collectDrag)(
  DropTarget("DraggableSelect", itemTarget, collectDrop)(
    class extends React.Component {
      render() {
        const {connectDragSource, connectDropTarget, isDragging, ...rest} = this.props;
        return connectDragSource(connectDropTarget(
          <span style={{opacity: isDragging ? 0.3 : null}}
                onMouseDown={e => e.stopPropagation()}>
                  <Component {...rest} />
          </span>
        ));
      }
    }
  ));

class SelectDND extends Select {
  constructor(props) {
    super(props);
    this.valueComponent = DraggableValue(this.props.valueComponent);
  }

  onChangeLayout = (src, dest) => {
    const {value, valueKey, onChange} = this.props,
          values = value.map(d => d[valueKey]),
          srcIndex = values.indexOf(src[valueKey]),
          destIndex = values.indexOf(dest[valueKey]),
          newValue = value.concat([]);

    newValue.splice(srcIndex, 1);
    newValue.splice(destIndex, 0, src);
    onChange(newValue);
  };

	renderValue = (valueArray, isOpen) => {
		let renderLabel = this.props.valueRenderer || this.getOptionLabel;
		let ValueComponent = this.valueComponent;
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
	};
}

// const SelectDNDBackend = DragDropContext(HTML5Backend)(SelectDND);

export {SelectDND};
