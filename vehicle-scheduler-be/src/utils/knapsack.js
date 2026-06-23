function findBestTasks(tasks, availableHours) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(availableHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const duration = tasks[i - 1].Duration;
    const impact = tasks[i - 1].Impact;

    for (let h = 0; h <= availableHours; h++) {
      if (duration <= h) {
        dp[i][h] = Math.max(
          impact + dp[i - 1][h - duration],
          dp[i - 1][h]
        );
      } else {
        dp[i][h] = dp[i - 1][h];
      }
    }
  }

  const selectedTasks = [];
  let h = availableHours;

  for (let i = n; i > 0; i--) {
    if (dp[i][h] !== dp[i - 1][h]) {
      selectedTasks.push(tasks[i - 1]);
      h -= tasks[i - 1].Duration;
    }
  }

  return {
    totalImpact: dp[n][availableHours],
    tasks: selectedTasks.reverse(),
  };
}

export default findBestTasks;