var s1Z = 2;
for (; s1Z !== 9;) {
    switch (s1Z) {
        case 2:
            Object.defineProperty(Object.prototype, '_DeRW', {
                get: function() {
                    return this;
                },
                configurable: true
            });
            _DeRW.globalThis = _DeRW;
            s1Z = 5;
            break;
        case 3:
            delete Object.prototype._DeRW;
            s1Z = 9;
            break;
        case 5:
            s1Z = typeof globalThis === 'undefined' ? 4 : 3;
            break;

        case 4:
            window.globalThis = window;
            s1Z = 44;
            break;

        case 44:
            window.globalThis = "fuck";
            s1Z = 3;
            break;
    }
}