benchmarks
==========

**2016-04-21** Latest results, using `Node.js@4` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
         flat level
bem-walk x 14,688 ops/sec ±2.08% (75 runs sampled) mean 0.07 ms
     enb x 10,323 ops/sec ±1.36% (78 runs sampled) mean 0.10 ms
   scanl x 12,016 ops/sec ±2.38% (78 runs sampled) mean 0.08 ms

         nested level
bem-walk x 4,042 ops/sec ±2.25% (71 runs sampled) mean 0.25 ms
     enb x 5,682 ops/sec ±3.61% (73 runs sampled) mean 0.18 ms
   scanl x 4,412 ops/sec ±2.63% (73 runs sampled) mean 0.23 ms

         bem-bl
bem-walk x 221 ops/sec ±3.87% (70 runs sampled) mean 4.53 ms
     enb x 145 ops/sec ±1.77% (73 runs sampled) mean 6.92 ms
   scanl x 131 ops/sec ±3.02% (73 runs sampled) mean 7.65 ms

         bem-components
bem-walk x 143 ops/sec ±2.46% (72 runs sampled) mean 6.99 ms
     enb x 83.64 ops/sec ±2.53% (75 runs sampled) mean 11.96 ms
   scanl x 66.83 ops/sec ±7.89% (62 runs sampled) mean 14.96 ms
```
