import { useState, useEffect, useCallback } from 'react';
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

function makeShareToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Standalone helper — used by PublicBracketView without needing the full hook
export async function fetchByShareToken(shareToken) {
  const q    = query(collection(db, 'brackets'), where('shareToken', '==', shareToken));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export function useFirestore(userId) {
  const [brackets,          setBrackets]          = useState([]);
  const [currentBracketId,  setCurrentBracketId]  = useState(null);
  const [loading,           setLoading]           = useState(false);

  const refreshBrackets = useCallback(async () => {
    if (!userId) { setBrackets([]); return; }
    setLoading(true);
    try {
      // No orderBy here — avoids needing a composite Firestore index.
      // Sort client-side instead.
      const q    = query(
        collection(db, 'brackets'),
        where('userId', '==', userId),
      );
      const snap = await getDocs(q);
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.lastUpdated?.seconds ?? 0) - (a.lastUpdated?.seconds ?? 0));
      setBrackets(docs);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refreshBrackets(); }, [refreshBrackets]);

  const loadBracket = useCallback(async (bracketId) => {
    const snap = await getDoc(doc(db, 'brackets', bracketId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }, []);

  const saveBracket = useCallback(async (bracketId, bracketState) => {
    if (!bracketId) return;
    await updateDoc(doc(db, 'brackets', bracketId), {
      bracketState,
      lastUpdated: serverTimestamp(),
    });
  }, []);

  const createBracket = useCallback(async (name, bracketState = null) => {
    if (!userId) return null;
    const defaultState = {
      stage: 'group', userName: name,
      groupPicks: {}, bestThirdPicks: [], knockoutPicks: {},
    };
    const ref = await addDoc(collection(db, 'brackets'), {
      userId,
      name,
      bracketState: bracketState ?? defaultState,
      isPublic:    false,
      shareToken:  null,
      createdAt:   serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });
    await refreshBrackets();
    return ref.id;
  }, [userId, refreshBrackets]);

  const deleteBracket = useCallback(async (bracketId) => {
    await deleteDoc(doc(db, 'brackets', bracketId));
    setBrackets(prev => prev.filter(b => b.id !== bracketId));
    if (currentBracketId === bracketId) setCurrentBracketId(null);
  }, [currentBracketId]);

  const renameBracket = useCallback(async (bracketId, name) => {
    await updateDoc(doc(db, 'brackets', bracketId), { name, lastUpdated: serverTimestamp() });
    setBrackets(prev => prev.map(b => b.id === bracketId ? { ...b, name } : b));
  }, []);

  const shareBracket = useCallback(async (bracketId) => {
    const existing = brackets.find(b => b.id === bracketId);
    if (existing?.shareToken) return existing.shareToken;
    const token = makeShareToken();
    await updateDoc(doc(db, 'brackets', bracketId), {
      isPublic:    true,
      shareToken:  token,
      lastUpdated: serverTimestamp(),
    });
    setBrackets(prev => prev.map(b =>
      b.id === bracketId ? { ...b, isPublic: true, shareToken: token } : b
    ));
    return token;
  }, [brackets]);

  return {
    brackets, currentBracketId, setCurrentBracketId, loading,
    loadBracket, saveBracket, createBracket, deleteBracket, renameBracket,
    shareBracket, refreshBrackets,
  };
}
