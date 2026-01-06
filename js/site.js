function cleanupOldViewKeys() {
  const today = new Date();
  const keepDays = 7;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('viewed_')) {
      const dateStr = key.split('_').pop(); // yyyy-mm-dd
      const keyDate = new Date(dateStr);
      const diff = (today - keyDate) / (1000 * 60 * 60 * 24);

      if (diff > keepDays) {
        localStorage.removeItem(key);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cleanupOldViewKeys();
  // Phần filter tag
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTag = urlParams.get('tag');
  const albums = document.querySelectorAll('.album');
  const heading = document.getElementById('main-heading');

  if (selectedTag) {
    const formattedTag = selectedTag.trim();
    heading.textContent = `Album: #${formattedTag}`;

    albums.forEach((album) => {
      const tags =
        album.dataset.tags?.split(',').map((tag) => tag.trim().toLowerCase()) ||
        [];
      if (tags.includes(formattedTag.toLowerCase())) {
        album.classList.remove('filter-hidden');
      } else {
        album.classList.add('filter-hidden');
      }
    });
  }
});
const firebaseConfig = {
  apiKey: 'AIzaSyCUeBT6oLyAWX7_uhZXDlrK_PXjCH6Ilds',
  authDomain: 'awesomedreamer.firebaseapp.com',
  projectId: 'awesomedreamer',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getAlbumId() {
  const path = location.pathname.split('/').pop();
  return path.replace('.html', '');
}

document.addEventListener('DOMContentLoaded', async () => {
  const albumId = getAlbumId();
  if (!albumId) return;

  const today = new Date().toISOString().slice(0, 10);
  const localKey = `viewed_${albumId}_${today}`;
  const ref = db.collection('views').doc(albumId);

  // ====== DETAIL PAGE ======
  const viewEl = document.getElementById('view-count');

  if (viewEl && !localStorage.getItem(localKey)) {
    await ref.set(
      {
        count: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );

    localStorage.setItem(localKey, '1');
  }

  // Hiển thị
  const snap = await ref.get();
  if (viewEl)
    viewEl.innerText = (snap.exists ? snap.data().count : 0) + ' views';

  // ====== ALBUM LIST ======
  document.querySelectorAll('.album-view').forEach(async (el) => {
    const id = el.dataset.id;
    const doc = await db.collection('views').doc(id).get();
    el.innerText = (doc.exists ? doc.data().count : 0) + ' views';
  });
});
