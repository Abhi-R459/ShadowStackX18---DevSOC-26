import { auth } from "./firebase";

// callBackend: call a backend endpoint with Firebase ID token in Authorization header.
// This centralizes token handling so all frontend requests are authenticated.
export async function callBackend(endpoint, method = "GET", body = null) {
  if (!auth || !auth.currentUser) {
    throw new Error("No authenticated user. Call must be made after login.");
  }

  // Get a fresh ID token for the current user
  const token = await auth.currentUser.getIdToken();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`http://localhost:5000${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { error: text || "request failed" };
    return data;
  } catch (e) {
    // If backend returned non-JSON, surface raw text
    if (!res.ok) throw { error: text || e.message };
    return text ? JSON.parse(text) : null;
  }
}

export default callBackend;

// uploadAudio: use XHR to provide upload progress notifications.
export function uploadAudio(endpoint, file, onProgress) {
  return new Promise(async (resolve, reject) => {
    if (!auth || !auth.currentUser) return reject(new Error("No authenticated user"));
    try {
      const token = await auth.currentUser.getIdToken();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `http://localhost:5000${endpoint}`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.responseType = "json";
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === "function") {
          onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(xhr.response || { status: xhr.status, text: xhr.responseText });
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      const formData = new FormData();
      formData.append("audio", file);
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}
