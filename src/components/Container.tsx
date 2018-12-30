import * as React from 'react';
import Card from './Card'
import { DropTarget, DropTargetMonitor, DropTargetCollector, ConnectDropTarget, DropTargetConnector } from 'react-dnd';
import * as Types from './Types'

interface ContainerState {
    cards: Array<Types.InfoCard>
}

interface CollectedProps {
	isOver: boolean
	canDrop: boolean
	connectDropTarget: ConnectDropTarget
}

class Container extends React.Component<CollectedProps, ContainerState> {
    constructor(props: CollectedProps) {
        super(props);
        const list: Array<Types.InfoCard> = [
			{ id: 1, text: "Item 1" },
			{ id: 2, text: "Item 2" },
			{ id: 3, text: "Item 3" }
        ];
    
        this.state = { cards: list };
    }

    /*pushCard(card: Types.InfoCard) {
        const newList = this.state.cards.slice()
        newList.push(card)
        this.setState({
            cards: newList
        })
    }

    removeCard(index: number) {
        const newList = this.state.cards.slice()
        newList.splice(index, 1)
        this.setState({
            cards: newList
        })
    }*/

    moveCard(dragIndex: number, hoverIndex: number) {
        const newList = this.state.cards.slice()
        const dragCard = newList[dragIndex]

        newList.splice(dragIndex, 1)
        newList.splice(hoverIndex, 0, dragCard)
        this.setState({cards: newList})
    }

    render() {
        const { cards } = this.state;
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        const style = {
            width: "200px",
            height: "404px",
            border: '1px dashed gray'
        };

        const backgroundColor = isActive ? 'lightgreen' : '#FFF';

        return connectDropTarget(
            <div style={{ ...style, backgroundColor }}>
                {cards.map((card, i) => {
                    return (
                        <Card
                            key={card.id}
                            index={i}
                            card={card}
                            moveCard={this.moveCard.bind(this)} />
                    );
                })}
            </div>
        );
    }
}
/*
const cardTarget = {
	drop(props: ContainerProps, monitor: DropTargetMonitor, component: Container ) {
        console.log('bbbbbbbbbbbbbbbbb')
		const { id } = props;
		const sourceObj = monitor.getItem();		
		if ( id !== sourceObj.listId ) {
            console.log('cccccccc')
            component.pushCard(sourceObj.card);
        }
		return {
			listId: id
		};
	}
}*/

const collect: DropTargetCollector<CollectedProps> = (connect: DropTargetConnector,
	monitor: DropTargetMonitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }
}
 
export default DropTarget("CARD", {}, collect)(Container);