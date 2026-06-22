import { useState } from 'react';

export default function ShareModal({ shareToken, bracketName, onShare, onClose }) {
  const [copied,  setCopied]  = useState(false);
  const [loading, setLoading] = useState(false);

  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : null;

  async function handleGenerate() {
    setLoading(true);
    try { await onShare(); }
    finally { setLoading(false); }
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="export-modal__header">
          <h2>Share Bracket</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="share-body">
          <p className="share-desc">
            Share <strong>{bracketName}</strong> with friends.
            Anyone with the link can view your picks in read-only mode.
          </p>

          {!shareToken ? (
            <button className="btn btn--primary" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating…' : '🔗 Generate Share Link'}
            </button>
          ) : (
            <>
              <div className="share-link-row">
                <input className="share-link-input" value={shareUrl} readOnly />
                <button className="btn btn--primary btn--small" onClick={handleCopy}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <p className="share-hint">Link is permanent — share it any time.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
