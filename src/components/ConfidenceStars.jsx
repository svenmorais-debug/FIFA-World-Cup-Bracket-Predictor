export default function ConfidenceStars({ value, onChange, small }) {
  return (
    <div className={`confidence-stars ${small ? 'confidence-stars--small' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn ${star <= (value || 0) ? 'star-btn--filled' : ''}`}
          onClick={(e) => { e.stopPropagation(); onChange(star); }}
          title={`Confidence: ${star}/5`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
