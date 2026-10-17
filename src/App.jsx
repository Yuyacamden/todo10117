import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('app_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '牛乳を買う', completed: false },
      { id: 2, text: 'Reactの勉強をする', completed: true }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // todos が変更されたら LocalStorage に保存
  useEffect(() => {
    localStorage.setItem('app_todos', JSON.stringify(todos));
  }, [todos]);

  // 新しいタスクを追加
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  // 完了・未完了の切り替え
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // タスクの削除
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // フィルター処理後のリスト
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 未完了タスクの数
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <header className="header">
        <h1>📱 My Todo</h1>
        <p className="subtitle">残りのタスク: {activeCount}件</p>
      </header>

      {/* タスク入力フォーム */}
      <form className="add-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="新しいタスクを入力..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="add-btn">
          追加
        </button>
      </form>

      {/* フィルター切り替えボタン */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          すべて
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          未完了
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          完了
        </button>
      </div>

      {/* タスク一覧 */}
      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-message">タスクはありません</li>
        ) : (
          filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkmark"></span>
                <span className="todo-text">{todo.text}</span>
              </label>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label="削除"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;