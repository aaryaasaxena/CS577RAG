# Intractability Example: Subset Sum is NP-Complete

## Problem
Given integers `a₁, ..., a_n` and target `T`, is there a subset whose sum is exactly `T`?

## Step 1: In NP
- Given a subset, verify its sum = T in polynomial time.

## Step 2: NP-Hard via Reduction
Reduce from **3-SAT**:
- Create numbers where digits encode variables and clauses
- Construct target sum so that a correct subset represents a valid assignment

(Simplified version: reduce from Partition or 3-CNF SAT in exams)

## Outline of Reduction (Conceptual)
- Encode each variable assignment as a number
- Encode clauses to ensure at least one literal is satisfied
- Target sum ensures all clauses are covered

✅ Subset Sum is NP-complete