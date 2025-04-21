# Randomization Example: Randomized Quicksort

## Problem
Sort an array using a randomized algorithm.

## Algorithm
1. Pick a random pivot
2. Partition array into <, =, > pivot
3. Recursively sort partitions

## Expected Runtime
Let T(n) be expected time to sort n items.

T(n) = (1/n) * sum_{i=1}^{n} [T(i-1) + T(n-i)] + O(n)  
⇒ T(n) = O(n log n)

## Proof of Correctness
Each call divides array by pivot; recursion eventually reaches base case (length ≤ 1)

✅ Always returns sorted array (Las Vegas algorithm)