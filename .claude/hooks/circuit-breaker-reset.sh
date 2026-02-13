#!/bin/bash
# Reset failure count on successful tool use
# Called by PostToolUse hook

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

if [ -z "$TOOL" ]; then
  exit 0
fi

FAIL_FILE="/tmp/claude/circuit-breaker-${TOOL}.count"

if [ -f "$FAIL_FILE" ]; then
  rm "$FAIL_FILE"
fi

exit 0
