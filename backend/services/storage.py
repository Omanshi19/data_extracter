"""
JobStore — thread-safe in-memory store.
Swap RedisJobStore for production deployments.
"""

import threading
from typing import Optional
from models import ExtractionJob


class JobStore:
    def __init__(self):
        self._store: dict[str, ExtractionJob] = {}
        self._lock = threading.Lock()

    def get(self, job_id: str) -> Optional[ExtractionJob]:
        with self._lock:
            return self._store.get(job_id)

    def set(self, job_id: str, job: ExtractionJob) -> None:
        with self._lock:
            self._store[job_id] = job

    def delete(self, job_id: str) -> None:
        with self._lock:
            self._store.pop(job_id, None)

    def all(self) -> list[ExtractionJob]:
        with self._lock:
            return list(self._store.values())


class RedisJobStore:
    """
    Production Redis-backed store.
    Usage: store = RedisJobStore(url=os.getenv("REDIS_URL"))
    """
    def __init__(self, url: str = "redis://localhost:6379", ttl: int = 3600):
        import redis
        self._r = redis.from_url(url)
        self._ttl = ttl

    def get(self, job_id: str) -> Optional[ExtractionJob]:
        raw = self._r.get(f"job:{job_id}")
        if raw:
            return ExtractionJob.model_validate_json(raw)
        return None

    def set(self, job_id: str, job: ExtractionJob) -> None:
        self._r.setex(f"job:{job_id}", self._ttl, job.model_dump_json())

    def delete(self, job_id: str) -> None:
        self._r.delete(f"job:{job_id}")
