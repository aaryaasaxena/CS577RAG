# Dynamic Programming Example: 0/1 Knapsack

## Problem
Given weights `w[]`, values `v[]`, and capacity `W`, select items to maximize value without exceeding capacity. Each item can be taken once.

## Algorithm (Bottom-up DP)
Let `dp[i][w]` = max value using first `i` items and capacity `w`.

## Pseudocode
```python
for i in range(n+1):
    for w in range(W+1):
        if i == 0 or w == 0:
            dp[i][w] = 0
        elif wt[i-1] <= w:
            dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])
        else:
            dp[i][w] = dp[i-1][w]
```

## Proof of Correctness (Induction)
**Base case**: i = 0 or w = 0 → dp[0][w] = 0 (correct)

**Inductive step**: Assume correct for i-1.
- If item i is not included → value is dp[i-1][w]
- If included → value is val[i-1] + dp[i-1][w-wt[i-1]]

Take max of both: preserves optimality. ✅