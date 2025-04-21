# Network Flow Example: Bipartite Matching

## Problem
Given a bipartite graph G=(U ∪ V, E), find the maximum matching.

## Reduction to Max-Flow
1. Add source `s` connected to all nodes in `U`
2. Add sink `t` connected from all nodes in `V`
3. All edges have capacity 1

## Use Edmonds-Karp to compute max flow from `s` to `t`.

## Proof of Correctness (Max-Flow Min-Cut Theorem)
- Every matching corresponds to a unit flow
- Maximum matching = Maximum flow in this network
- No augmenting path ⇒ flow is maximal

✅ Max-flow gives correct bipartite matching