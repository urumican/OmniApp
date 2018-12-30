import * as React from 'react';
import { DragSource, DropTarget, ConnectDragSource, ConnectDropTarget, DropTargetMonitor, XYCoord } from 'react-dnd';
import * as Types from './Types'
import { findDOMNode } from 'react-dom';
import { flow } from 'lodash'
 
const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	margin: '.5rem',
	backgroundColor: 'white',
	cursor: 'move'
};

interface CardPorps {
    card: Types.InfoCard
    index: number
    moveCard: Function
}

interface CardDndProps {
    isDragging: boolean
    connectDragSource: ConnectDragSource
    connectDropTarget: ConnectDropTarget
}
 
class Card extends React.Component<CardPorps&CardDndProps> {
 
	render() {
		const { card, isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;
 
		return connectDragSource(connectDropTarget(
			<div style={{ ...style, opacity }}>
				{card.text}
			</div>
		));
	}
}

const cardSource = {
 
	beginDrag(props: CardPorps) {	
		
		return {			
			index: props.index,
			card: props.card
		};
	}
};

const cardTarget = {
 
	hover(props: CardPorps, monitor: DropTargetMonitor, component: Card) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;
 
		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}
 
        // Determine rectangle on screen
        const node = findDOMNode(component) as Element
		const hoverBoundingRect = node.getBoundingClientRect();
 
		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
 
		// Determine mouse position
		const clientOffset = monitor.getClientOffset() as XYCoord;
 
		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;
 
		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%
 
		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}
 
		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}
 
		// Time to actually perform the action
		//if ( props.listId === sourceListId ) {
			props.moveCard(dragIndex, hoverIndex);
 
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		//}		
	}
};

export default flow(
	DropTarget("CARD", cardTarget, connect => ({
		connectDropTarget: connect.dropTarget()
	})),
	DragSource("CARD", cardSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}))
)(Card);