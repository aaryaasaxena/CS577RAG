# Greedy Algorithm Example: Activity Selection

## Problem
Given `n` activities with start and finish times, select the maximum number of non-overlapping activities.  
Each activity `i` has a start time `s_i` and finish time `f_i`.  
The goal is to select the maximum subset of mutually compatible activities.

## Algorithm Design (Greedy)
1. Sort activities by their finish time `f_i` in ascending order.
2. Select the first activity.
3. For each subsequent activity, if its start time is ≥ the finish time of the last selected activity, include it.

## Pseudocode
```python
activities.sort(key=lambda x: x[1])  # sort by finish time
last_end = -inf
selected = []
for start, end in activities:
    if start >= last_end:
        selected.append((start, end))
        last_end = end
```

## Proof of Correctness (Exchange Argument)
Let `A` be the greedy solution and `O` be an optimal solution.

- Suppose A = {a₁, a₂, ..., a_k}, and O = {o₁, o₂, ..., o_m} with m ≥ k.
- We’ll show by exchange argument that A is optimal by transforming O into A.
- Since activities are sorted by finish time, `f(a₁) ≤ f(o₁)`. Replace `o₁` with `a₁`.
- This replacement preserves compatibility since `a₁` finishes earlier or at the same time.
- Repeat for each subsequent activity.

Thus, A is at least as good as O. ✅