// nile-auth.js · Apple / Google sign-in for the Crafted Tales storybook, and the visitor list.
// Firebase itself loads from Google's CDN (www.gstatic.com); this file only wires it up.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp, increment
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore-lite.js';

let auth, db;

function providerName(user) {
  const p = (user.providerData[0] || {}).providerId || '';
  return p === 'apple.com' ? 'Apple' : p === 'google.com' ? 'Google' : p;
}

async function record(user, appleName) {
  if (!db) return;
  const ref = doc(db, 'storybook_visitors', user.uid);
  const name = user.displayName || appleName || '';
  try {
    const snap = await getDoc(ref).catch(() => null);
    const data = { email: user.email || '', provider: providerName(user), lastSeen: serverTimestamp(), visits: increment(1) };
    if (name) data.name = name;
    if (!snap || !snap.exists()) data.firstSeen = serverTimestamp();
    await setDoc(ref, data, { merge: true });
  } catch (e) { /* the book still opens if saving fails */ }
}

window.NileAuth = {
  init(config) {
    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  },
  // resolves once, with the signed-in user or null, when the page loads
  ready() {
    return new Promise((res) => { const off = onAuthStateChanged(auth, (u) => { off(); res(u); }); });
  },
  async signIn(which) {
    let provider;
    if (which === 'apple') {
      provider = new OAuthProvider('apple.com');
      provider.addScope('email'); provider.addScope('name');
    } else {
      provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
    }
    const result = await signInWithPopup(auth, provider);
    // Apple shares the person's name only on their very first sign-in
    let appleName = '';
    try {
      const extra = result._tokenResponse || {};
      appleName = [extra.firstName, extra.lastName].filter(Boolean).join(' ');
    } catch (e) {}
    await record(result.user, appleName);
    return result.user;
  },
  visit(user) { return record(user, ''); },
  signOut() { return signOut(auth); }
};
window.dispatchEvent(new Event('nile-auth-ready'));
