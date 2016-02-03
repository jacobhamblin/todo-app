import Redux from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };

    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo(t, action)
      );
    case 'REMOVE_TODO':
      let index = -1;
      for (let i = 0; i < state.length; i++) {
        state[i].id === action.id ? index = i : null;
      }

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]
    default:
      return state;
  }
}

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

import { combineReducers } from 'redux';
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

import { createStore } from 'redux';
const store = createStore(todoApp);

import { Component } from 'react';

const FilterLink = ({
  filter, children
}) => {
  return (
    <a href='#'
      onClick={e => {
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
      }}
    >
      {children}
    </a>
  );
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    const visibleTodos = getVisibleTodos(
      this.props.todos,
      this.props.visibilityFilter
    );

    return (
      <div>
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id}>
              {todo.text}
              <button onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              }}>
                toggle completed
              </button>
              <button onClick={() => {
                store.dispatch({
                  type: 'REMOVE_TODO',
                  id: todo.id
                });
              }}>
                del
              </button>
            </li>
          )}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_ACTIVE'
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_COMPLETED'
          >
            Completed
          </FilterLink>
        </p>
      </div>
    )
  }
}

const render = () => {
  console.log(store.getState())
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.querySelectorAll('#root')[0]
  )
};

store.subscribe(render);
render();
