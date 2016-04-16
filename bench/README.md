benchmarks
==========

**2016-04-16** Latest results, using `Node.js@4` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
         flat level
bem-walk x 12,090 ops/sec ±4.70% (72 runs sampled) mean 0.08 ms
     enb x 9,829 ops/sec ±2.19% (81 runs sampled) mean 0.10 ms
   scanl x 12,234 ops/sec ±2.59% (81 runs sampled) mean 0.08 ms

         nested level
bem-walk x 4,637 ops/sec ±2.05% (79 runs sampled) mean 0.22 ms
     enb x 6,034 ops/sec ±1.82% (81 runs sampled) mean 0.17 ms
   scanl x 4,500 ops/sec ±2.29% (76 runs sampled) mean 0.22 ms

         bem-bl
bem-walk x 207 ops/sec ±1.20% (79 runs sampled) mean 4.83 ms
     enb x 147 ops/sec ±1.68% (76 runs sampled) mean 6.79 ms
   scanl x 143 ops/sec ±1.90% (81 runs sampled) mean 7.00 ms

         bem-components
bem-walk x 132 ops/sec ±2.13% (76 runs sampled) mean 7.58 ms
     enb x 86.25 ops/sec ±1.98% (79 runs sampled) mean 11.59 ms
   scanl x 80.86 ops/sec ±3.02% (74 runs sampled) mean 12.37 ms
```
