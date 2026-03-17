# Skill: Morning Call

Sets up the daily morning call cron job for Master Isaac at 9am Singapore time (GMT+8, which is UTC+8 — cron runs in local time).

## When to invoke

- At the start of a new Claude Code session
- When Master Isaac asks to "start the morning call" or "set up the morning call"
- When the previous session's cron has expired

## What to do

1. Use `CronCreate` with the following settings:
   - **cron:** `0 9 * * 1-5` (9:00am local time, Monday–Friday)
   - **recurring:** `true`
   - **prompt:** (see below)

2. Confirm to Master Isaac that the morning call cron is active, and remind him it is session-only (will need to be re-run next session).

## Morning Call Prompt

```
Good morning, Master Isaac. It is time for your morning call.

Please do the following:

1. Review `context/current-priorities.md` and `context/goals.md`
2. Check for any upcoming deadlines across all active projects in `projects/`
3. Surface any items that are due within the next 7 days
4. Provide a brief, structured briefing:
   - Upcoming deadlines (next 7 days)
   - Top priorities for today
   - Any blockers or items requiring attention

Keep it sharp and concise. Begin the briefing now.
```

## Notes

- The cron is **session-only** — it does not persist when Claude Code is closed
- It **auto-expires after 3 days** — re-run this skill every 3 days or at the start of each session
- Singapore time is GMT+8. If Claude Code is running on a machine set to a different timezone, adjust the cron hour accordingly (e.g. UTC would be `3 1 * * *`)
- Future improvement: connect a Slack MCP server to push morning call notifications externally
