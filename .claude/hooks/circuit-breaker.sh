#!/bin/bash
# Circuit Breaker — blocks a tool after 3 consecutive failures
# Used as PreToolUse hook
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

if [ -z "$TOOL" ]; then
  exit 0
fi

FAIL_FILE="/tmp/claude/circuit-breaker-${TOOL}.count"

if [ -f "$FAIL_FILE" ]; then
  COUNT=$(cat "$FAIL_FILE")
  if [ "$COUNT" -ge 3 ]; then
    echo "Circuit OPEN: ${TOOL} has failed ${COUNT} consecutive times. Try an alternative approach or fix the underlying issue." >&2
    exit 2
  fi
fi

exit 0
