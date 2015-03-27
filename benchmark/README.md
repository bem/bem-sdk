benchmarks
==========

**2015-03-27** Latest results, using `Node.js@0.12` and latest versions of modules:

* `enb@0.15.0`
* `scan-level@0.0.4`

```
                      bem-walk
          11,155 op/s » `flat` level
           4,454 op/s » `nested` level
             185 op/s » `bem-bl`
             140 op/s » `bem-core` + `bem-components`

                      enb@0.x
           8,884 op/s » `flat` level
           5,870 op/s » `nested` level
             118 op/s » `bem-bl`
              84 op/s » `bem-core` + `bem-components`

                      scan-level
          12,079 op/s » `flat` level
           5,101 op/s » `nested` level
             127 op/s » `bem-bl`
              90 op/s » `bem-core` + `bem-components`


  Suites:  3
  Benches: 12
  Elapsed: 20,228.72 ms
```
