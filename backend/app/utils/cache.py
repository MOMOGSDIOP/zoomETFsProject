import time
from threading import Lock

class SimpleCache:
    def __init__(self):
        self._store = {}
        self._lock = Lock()

    def set(self, key, value, expire=None):
        with self._lock:
            expire_at = time.time() + expire if expire else None
            self._store[key] = (value, expire_at)

    def get(self, key):
        with self._lock:
            data = self._store.get(key)
            if not data:
                return None
            value, expire_at = data
            if expire_at and expire_at < time.time():
                del self._store[key]
                return None
            return value

    def delete(self, key):
        with self._lock:
            self._store.pop(key, None)

cache = SimpleCache()
