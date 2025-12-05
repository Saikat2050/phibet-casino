/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const ReorderComponent = ({ formattedState, state, setState }) => {
	const reorder = (categories, startIndex, endIndex) => {
		const result = Array.from(categories);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const rows = reorder(
			state.rows,
			result.source.index,
			result.destination.index
		);
		setState({ rows, count: rows.length });
	};

	return state.count > 0 ? (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="list">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{formattedState?.length > 0 &&
							formattedState?.map((item, index) => (
								<Draggable
									key={item.reorderId}
									draggableId={`id-${item.reorderId}`}
									index={index}
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<Row className="drag-table">
												{Object.keys(item).map((key) => (
													<Col key={key} className="drag-table--detail">
														{key === 'isActive' ? (
															item[key] ? (
																<span className="bg-success badge bg-secondary">
																	Active
																</span>
															) : (
																<span className="bg-danger badge bg-secondary">
																	Inactive
																</span>
															)
														) : (
															item[key]
														)}
													</Col>
												))}
											</Row>
										</div>
									)}
								</Draggable>
							))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	) : (
		<p className="text-center text-danger mt-3"> No Data Found </p>
	);
};

ReorderComponent.propTypes = {
	formattedState: PropTypes.arrayOf.isRequired,
	state: PropTypes.objectOf.isRequired,
	setState: PropTypes.func.isRequired,
};

export default ReorderComponent;
