import { useState, useRef, useEffect } from 'react';

export default function BracketsMenu({ brackets, currentId, onSelect, onCreate, onDelete, onRename }) {
  const [open,      setOpen]      = useState(false);
  const [renaming,  setRenaming]  = useState(null);
  const [nameInput, setNameInput] = useState('');
  const menuRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = brackets.find(b => b.id === currentId);

  function startRename(b, e) {
    e.stopPropagation();
    setRenaming(b.id);
    setNameInput(b.name);
  }

  function commitRename(e) {
    e?.preventDefault();
    if (nameInput.trim() && renaming) onRename(renaming, nameInput.trim());
    setRenaming(null);
  }

  function handleNew() {
    setOpen(false);
    const name = `Prediction ${brackets.length + 1}`;
    onCreate(name);
  }

  return (
    <div className="brackets-menu" ref={menuRef}>
      <button className="brackets-trigger" onClick={() => setOpen(o => !o)}>
        <span className="brackets-trigger__name">{current?.name ?? 'My Brackets'}</span>
        <span className="brackets-trigger__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="brackets-dropdown">
          {brackets.length === 0 && (
            <div className="brackets-empty">No brackets yet</div>
          )}
          {brackets.map(b => (
            <div key={b.id} className={`brackets-item ${b.id === currentId ? 'brackets-item--active' : ''}`}>
              {renaming === b.id ? (
                <form className="brackets-rename-form" onSubmit={commitRename}>
                  <input
                    className="brackets-rename-input"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    autoFocus
                    onBlur={commitRename}
                  />
                </form>
              ) : (
                <>
                  <button className="brackets-item__name" onClick={() => { onSelect(b.id); setOpen(false); }}>
                    {b.id === currentId && <span className="brackets-item__dot">●</span>}
                    {b.name}
                  </button>
                  <div className="brackets-item__actions">
                    <button className="brackets-action-btn" title="Rename" onClick={e => startRename(b, e)}>✏️</button>
                    {brackets.length > 1 && (
                      <button
                        className="brackets-action-btn"
                        title="Delete"
                        onClick={e => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${b.name}"? This cannot be undone.`)) {
                            onDelete(b.id);
                            setOpen(false);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="brackets-divider" />
          <button className="brackets-new-btn" onClick={handleNew}>
            + New Bracket
          </button>
        </div>
      )}
    </div>
  );
}
