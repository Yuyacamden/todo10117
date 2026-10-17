import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // カテゴリを state で管理（LocalStorageに保存）
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('app_categories');
    return saved ? JSON.parse(saved) : ['買い物', 'やりたいこと', '仕事', 'その他'];
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('app_todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '牛乳を買う', completed: false, category: '買い物' },
      { id: 2, text: 'Reactの勉強をする', completed: true, category: '仕事' }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState(categories[0] || 'その他');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 各カテゴリ名

  // 新規カテゴリ追加用のフォーム入力状態
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // todos が変更されたら LocalStorage に保存
  useEffect(() => {
    localStorage.setItem('app_todos', JSON.stringify(todos));
  }, [todos]);

  // categories が変更されたら LocalStorage に保存
  useEffect(() => {
    localStorage.setItem('app_categories', JSON.stringify(categories));
    // もし選択中の入力カテゴリが削除された場合へのフォールバック
    if (!categories.includes(inputCategory) && categories.length > 0) {
      setInputCategory(categories[0]);
    }
  }, [categories, inputCategory]);

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

  // 新しいカテゴリを追加
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (categories.includes(trimmed)) {
      alert('すでに同じ名前のカテゴリが存在します。');
      return;
    }

    setCategories([...categories, trimmed]);
    setInputCategory(trimmed); // 追加したカテゴリを自動選択
    setNewCatName('');
    setIsAddingCat(false);
  };

  // カテゴリを削除
  const handleDeleteCategory = (catToDelete, e) => {
    e.stopPropagation(); // フィルタ選択イベントが発火するのを防ぐ
    if (categories.length <= 1) {
      alert('すべてのカテゴリを削除することはできません。');
      return;
    }

    if (window.confirm(`カテゴリ「${catToDelete}」を削除しますか？\n（このカテゴリのタスクは「その他」に移動します）`)) {
      // 削除されるカテゴリのタスクを「その他」に移動（「その他」がない場合は強制生成）
      const updatedCategories = categories.filter((cat) => cat !== catToDelete);
      if (!updatedCategories.includes('その他')) {
        updatedCategories.push('その他');
      }

      setTodos(
        todos.map((todo) =>
          todo.category === catToDelete ? { ...todo, category: 'その他' } : todo
        )
      );

      setCategories(updatedCategories);

      // フィルター中で選択していた場合は「すべて」に戻す
      if (filterCategory === catToDelete) {
        setFilterCategory('all');
      }
    }
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
    if (filterStatus === 'active' && todo.completed) return false;
    if (filterStatus === 'completed' && !todo.completed) return false;
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
            {categories.map((cat) => (
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

      {/* カテゴリ管理エリア（追加・削除） */}
      <div className="category-manager-bar">
        {!isAddingCat ? (
          <button className="add-cat-toggle-btn" onClick={() => setIsAddingCat(true)}>
            ＋ 新しいカテゴリを追加
          </button>
        ) : (
          <form className="add-cat-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              className="cat-name-input"
              placeholder="新しいカテゴリ名..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="cat-save-btn">追加</button>
            <button type="button" className="cat-cancel-btn" onClick={() => setIsAddingCat(false)}>キャンセル</button>
          </form>
        )}
      </div>

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

      {/* カテゴリ 絞り込みタブ（削除ボタン付き） */}
      <div className="category-filter">
        <span className="filter-label">カテゴリ:</span>
        <button
          className={`cat-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`cat-btn-wrapper ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            <span className="cat-btn-text">{cat}</span>
            {categories.length > 1 && (
              <button
                type="button"
                className="cat-delete-x"
                onClick={(e) => handleDeleteCategory(cat, e)}
                title="カテゴリを削除"
              >
                ×
              </button>
            )}
          </div>
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
                <span className="category-badge">
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