import * as api from '../utils/api/likerland';

let bookmarks = new Set<string>();

export async function refreshBookmark() {
  const newBookmarks = await api.refreshBookmarkList();
  bookmarks = new Set<string>(
    newBookmarks.map(url => {
      return encodeURIComponent(url);
    })
  );
}

export async function addBookmark(url: string) {
  await api.addBookmark(url);
  bookmarks.add(encodeURIComponent(url));
}

export async function removeBookmark(url: string) {
  await api.removeBookmark(url);
  bookmarks.delete(encodeURIComponent(url));
}

export function isBookmarked(url: string): boolean {
  return bookmarks.has(encodeURIComponent(url));
}
