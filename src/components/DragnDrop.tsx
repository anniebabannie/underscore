import React, { useState, useRef, useEffect, useContext, MouseEvent } from 'react'
import PropTypes from 'prop-types'
// import * as dropEffects from './dropEffects'
import Aux from './Aux'

type DnDDragState = "start" | "update" | "over" | "";

export type DnDState = {
  isDragging?: string,
  isDraggingOver?: string,
  dragCanceled?: boolean,
  update?: (u: DnDState) => void,
  dragStage?: DnDDragState
}
const Context = React.createContext<DnDState | null>(null)

/////////// CONTEXT /////////////

export const DnDContext = (props: {
  onDragStart?: (state: DnDState) => void,
  onDragUpdate: (state: DnDState) => void,
  onDrop: (state: DnDState) => void,
  children?: any
}) => {
  const [state, setState] = useState<DnDState>({
    isDragging: '',
    isDraggingOver: '',
    dragCanceled: false,
    update: (u) => updateContext(u)
  });

  useContext(Context);
  // const context = useContext(Context);
  function updateContext(updates: DnDState) {
    setState(prevState => ({...prevState, ...updates}))
  }

  useEffect(() => {
    switch(state.dragStage) {
      case "start":
        onDragStart()
        break;
      case "update":
        onDragUpdate()
        break;
      case "over":
        onDragUpdate()
        break;
      default:
        onDrop()
    }
  }, [state.dragStage])


  function onDragStart() {
    if (props.onDragStart) props.onDragStart(state)
  }

  function onDragUpdate() {
    if (props.onDragUpdate) props.onDragUpdate(state)
  }

  function onDrop() {
    if (props.onDrop) props.onDrop(state)
    updateContext({
      isDraggingOver: '',
      isDragging: '',
      dragCanceled: false
    })
  }

  return(
    <Aux onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDrop={onDrop}>
      <Context.Provider value={state}>
        {props.children}
      </Context.Provider>
    </Aux>
  )
}

DnDContext.propTypes = {
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  onDrop: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

///////////  DRAG  /////////////

export const Drag = (props: {
  dragId: string,
  children?: any,
  className?: string,
}) => {
  const context = useContext(Context) as DnDState;
  const elem = useRef(null)

  function startDrag(_e: any) {
    if (!context.update) return;
    context.update({
      isDragging: props.dragId,
      dragStage: "start"
    })
  }

  function drag(_e: any) {
    if (!context.update) return;
    context.update({
      dragStage: "update"
    })
  }

  function dragOver(_e: any) {
  }

  function dragLeave(_e: any) {
  }

  function dragEnd(_e: any) {
    if (!context.update) return;
    context.update({
      dragStage: '',
      dragCanceled: true
    })
  }

  return(
    <div className={props.className} draggable onDragStart={startDrag} onDrag={drag} onDragOver={dragOver} onDragLeave={dragLeave} onDragEnd={dragEnd} ref={elem}>
      {props.children}
    </div>
  )
}

Drag.propTypes = {
    dragId: PropTypes.string.isRequired,
    index: PropTypes.number,
    // dropEffect: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

Drag.defaultProps = {
    dragImage: null,
    // dropEffect: dropEffects.All,
};

/////////// DROP TARGET /////////////

export const DropTarget = (props: {
  isDropDisabled: boolean,
  dropId: string,
  className?: string,
  children: any
}) => {
  const context = useContext(Context) as DnDState;

  function dragEnter(_e: any) {
    if (props.isDropDisabled) return;
    if (!context.update) return;
    context.update({
      isDraggingOver: props.dropId,
      dragStage: "over"
    })
  }

  function dragOver(e: MouseEvent) {
    e.preventDefault();
  }

  function dragLeave(_e: any) {
  }

  function drop(_e: any) {
    if (props.isDropDisabled) return;
    if (!context.update) return;
    context.update({
      dragStage: '',
      dragCanceled: false
    })
  }

  return(
    <div className={props.className} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={drop}>
      {props.children}
    </div>
  )
}

DropTarget.propTypes = {
    dropId: PropTypes.string.isRequired,
    // dropEffect: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

DropTarget.defaultProps = {
    // dropEffect: dropEffects.All,
};
