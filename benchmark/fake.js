var arr = [1, 2, 3, 4, 5, 6];

suite('fake', function () {
    bench('fake', function () {
        var l = arr.length,
            args = new Array(l - 1);

        for (var i = 1; i < l; ++i) {
            args[i - 1] = arr[i];
        }
    });
});
