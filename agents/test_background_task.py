import asyncio
import io
import unittest
from contextlib import redirect_stdout

from agents.background_task import observe_task


class BackgroundTaskTests(unittest.TestCase):
    def test_observer_reports_unexpected_failure(self):
        async def fail() -> None:
            raise RuntimeError("boom")

        async def exercise(output: io.StringIO) -> None:
            task = asyncio.create_task(fail())
            observe_task(task, label="test task")
            await asyncio.gather(task, return_exceptions=True)
            await asyncio.sleep(0)

        output = io.StringIO()
        with redirect_stdout(output):
            asyncio.run(exercise(output))

        self.assertIn("test task failed: boom", output.getvalue())


if __name__ == "__main__":
    unittest.main()
