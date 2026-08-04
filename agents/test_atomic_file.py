import tempfile
import unittest
from pathlib import Path

from agents.atomic_file import append_text_atomic, write_text_atomic


class AtomicFileTests(unittest.TestCase):
    def test_replaces_content_without_leaving_temp_files(self):
        with tempfile.TemporaryDirectory(prefix="marketpulse-atomic-") as directory:
            target = Path(directory) / "context.md"
            write_text_atomic(target, "first")
            write_text_atomic(target, "second")

            self.assertEqual(target.read_text(encoding="utf-8"), "second")
            self.assertEqual(list(Path(directory).iterdir()), [target])

    def test_append_is_serialized_and_atomic(self):
        with tempfile.TemporaryDirectory(prefix="marketpulse-atomic-") as directory:
            target = Path(directory) / "context.md"
            append_text_atomic(target, "one\n")
            append_text_atomic(target, "two\n")

            self.assertEqual(target.read_text(encoding="utf-8"), "one\ntwo\n")
            self.assertTrue((Path(directory) / ".context.md.lock").is_file())


if __name__ == "__main__":
    unittest.main()
