from __future__ import annotations

import argparse

from .config import settings
from .database import Database
from .dashboard import serve
from .digest import build_digest
from .pipeline import run


def main() -> None:
    parser = argparse.ArgumentParser(description="Tıp Öğrencileri Editoryal Radar")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("init")
    run_parser = sub.add_parser("run")
    run_parser.add_argument("--source")
    sub.add_parser("list-candidates")
    for name in ("approve", "reject"):
        p = sub.add_parser(name)
        p.add_argument("id", type=int)
    dash = sub.add_parser("dashboard")
    dash.add_argument("--port", type=int, default=8765)
    digest_parser = sub.add_parser("digest")
    digest_parser.add_argument("--hours", type=int, default=24)
    args = parser.parse_args()
    db = Database(settings.db_path)
    db.init()
    if args.command == "init":
        print(f"Veritabanı hazır: {settings.db_path}")
    elif args.command == "run":
        print(run(settings, args.source))
    elif args.command == "list-candidates":
        for row in db.list_candidates():
            print(row["id"], row["status"], row["urgency_score"], row["institution"], row["title"])
    elif args.command in {"approve", "reject"}:
        db.set_status(args.id, "approved" if args.command == "approve" else "rejected")
        print("Güncellendi")
    elif args.command == "dashboard":
        serve(db, port=args.port)
    elif args.command == "digest":
        print(build_digest(db, args.hours))


if __name__ == "__main__":
    main()

