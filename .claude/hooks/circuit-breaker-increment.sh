#!/bin/bash
# Increment failure count for circuit breaker
# Called by PostToolUseFailure hook

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

if [ -z "$TOOL" ]; then
  exit 0
fi

FAIL_FILE="/tmp/claude/circuit-breaker-${TOOL}.count"
mkdir -p /tmp/claude

if [ -f "$FAIL_FILE" ]; then
  COUNT=$(cat "$FAIL_FILE")
  echo $((COUNT + 1)) > "$FAIL_FILE"
else
  echo 1 > "$FAIL_FILE"
fi

exit 0
