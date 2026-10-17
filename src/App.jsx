import React, { useState, useEffect } from 'react';
import './App.css';

// 利用可能なカテゴリ一覧
const CATEGORIES = ['買い物', 'やりたいこと', '仕事', 'その他'];

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('app_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '牛乳を買う', completed: false, category: '買い物' },
      { id: 2, text: 'Reactの勉強をする', completed: true, category: '仕事' },
      { id: 3, text: '映画を見に行く', completed: false, category: 'やりたいこと' }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState('買い物'); // 追加時のカテゴリ初期値
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 各カテゴリ名

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
      completed: false,
      category: inputCategory
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

  // フィルター処理後のリスト（状態 ＋ カテゴリ でダブル絞り込み）
  const filteredTodos = todos.filter((todo) => {
    // 状態フィルター
    if (filterStatus === 'active' && todo.completed) return false;
    if (filterStatus === 'completed' && !todo.completed) return false;

    // カテゴリフィルター
    if (filterCategory !== 'all' && (todo.category || 'その他') !== filterCategory) return false;

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
        <div className="input-group">
          <input
            type="text"
            className="todo-input"
            placeholder="新しいタスクを入力..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <select
            className="category-select"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="add-btn">
          追加
        </button>
      </form>

      {/* 完了・未完了 フィルター */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          すべて
        </button>
        <button
          className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
          onClick={() => setFilterStatus('active')}
        >
          未完了
        </button>
        <button
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          完了
        </button>
      </div>

      {/* カテゴリ 絞り込みタブ */}
      <div className="category-filter">
        <span className="filter-label">カテゴリ:</span>
        <button
          className={`cat-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          すべて
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
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
              <div className="todo-right">
                <span className={`category-badge cat-${todo.category || 'その他'}`}>
                  {todo.category || 'その他'}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="削除"
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;