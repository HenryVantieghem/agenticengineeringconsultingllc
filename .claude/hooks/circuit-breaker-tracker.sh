#!/bin/bash
# Circuit Breaker Tracker — increments failure count on PostToolUseFailure, resets on PostToolUse success
# Used as both PostToolUse (success) and PostToolUseFailure hooks
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')

if [ -z "$TOOL" ]; then
  exit 0
fi

FAIL_FILE="/tmp/claude/circuit-breaker-${TOOL}.count"

if [ "$HOOK_EVENT" = "PostToolUseFailure" ]; then
  # Increment failure count
  if [ -f "$FAIL_FILE" ]; then
    COUNT=$(cat "$FAIL_FILE")
    echo $((COUNT + 1)) > "$FAIL_FILE"
  else
    echo 1 > "$FAIL_FILE"
  fi
else
  # Success — reset the counter
  if [ -f "$FAIL_FILE" ]; then
    rm "$FAIL_FILE"
  fi
fi

exit 0
