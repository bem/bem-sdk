benchmarks
==========

**2016-04-15** Latest results, using `Node.js@4` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
         flat level
bem-walk x 12,790 ops/sec ±2.39% (76 runs sampled) mean 0.08 ms
     enb x 10,585 ops/sec ±1.03% (81 runs sampled) mean 0.09 ms
   scanl x 12,325 ops/sec ±1.99% (81 runs sampled) mean 0.08 ms

         nested level
bem-walk x 4,494 ops/sec ±2.43% (77 runs sampled) mean 0.22 ms
     enb x 6,189 ops/sec ±1.41% (82 runs sampled) mean 0.16 ms
   scanl x 4,509 ops/sec ±2.80% (78 runs sampled) mean 0.22 ms

         bem-bl
bem-walk x 204 ops/sec ±2.38% (78 runs sampled) mean 4.91 ms
     enb x 149 ops/sec ±1.36% (77 runs sampled) mean 6.71 ms
   scanl x 136 ops/sec ±2.63% (78 runs sampled) mean 7.37 ms

         bem-components
bem-walk x 133 ops/sec ±1.48% (76 runs sampled) mean 7.50 ms
     enb x 87.44 ops/sec ±1.79% (80 runs sampled) mean 11.44 ms
   scanl x 85.13 ops/sec ±1.65% (78 runs sampled) mean 11.75 ms
```
