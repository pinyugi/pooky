function M4Vs() {
    var E02w = 2;
    for (; E02w !== 3;) {
        switch (E02w) {
            case 2:
                E02w = typeof globalThis === 'object' ? 1 : 5;
                break;
            case 1:
                return globalThis;
                break;
            case 5:
                try {
                    var Z02w = 2;
                    for (; Z02w !== 9;) {
                        switch (Z02w) {
                            case 2:
                                Object.defineProperty(Object.prototype, 'NWuWT', {
                                    get: function() {
                                        return this;
                                    },
                                    configurable: true
                                });
                                NWuWT.globalThis = NWuWT;
                                Z02w = 5;
                                break;
                            case 5:
                                Z02w = typeof globalThis === 'undefined' ? 4 : 3;
                                break;
                            case 4:
                                window.globalThis = window;
                                Z02w = 3;
                                break;
                            case 3:
                                delete Object.prototype.NWuWT;
                                Z02w = 9;
                                break;
                        }
                    }
                } catch (p02w) {
                    window.globalThis = window;
                }
                return globalThis;
                break;
        }
    }
}