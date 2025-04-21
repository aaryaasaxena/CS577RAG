# Divide and Conquer Example: Merge Sort

## Problem
Sort an array of `n` elements in non-decreasing order.

## Algorithm
1. Divide array into two halves
2. Recursively sort each half
3. Merge the two sorted halves

## Pseudocode
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr)//2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
```

## Proof of Correctness (Strong Induction)
**Base case**: n = 1. Already sorted.

**Inductive step**: Assume merge_sort correctly sorts all arrays of size < n.
- Divide into subarrays of size < n
- Recursively sort them (by inductive hypothesis)
- Merge them into a sorted array

Hence, by strong induction, merge_sort is correct. ✅

## Time Complexity
T(n) = 2T(n/2) + O(n) ⇒ **T(n) = O(n log n)** (Master Theorem)