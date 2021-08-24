(() => {
    function getParams() {
        const params = {};
        location.search
            .slice(1)
            .split('&')
            .map(e => e.split('='))
            .forEach(e => params[e[0]] = e[1]);
        return params;
    }

    function createURL(options) {
        const queryString = Object.keys(options).map(k => `${k}=${options[k]}`).join('&');
        return `${location.protocol}//${location.hostname}${location.pathname}?${queryString}`;
    }

    function createButton(gl) {
        const e = document.createElement('a');
        const params = getParams();
        Object.assign(params, { gl });
        e.textContent = `Switch to '${gl.toUpperCase()}'`;
        e.style = 'margin-left: 10px; cursor: pointer;';
        e.addEventListener('click', () => {
            const ev = new CustomEvent('shosato.jp/switch-lang', { detail: { gl } });
            document.addEventListener('shosato.jp/switch-lang/r', () => {
                location.href = createURL(params);
            });
            document.dispatchEvent(ev);
        });
        document.querySelector('#hdtb-msb').appendChild(e);
    }

    function insertUI() {
        // switcher
        const ev = new CustomEvent('shosato.jp/switch-lang/gls');
        document.addEventListener('shosato.jp/switch-lang/gls/r', (result) => {
            const gls = result.detail.gls;
            const params = getParams();
            gls.forEach(gl => {
                if (!params.gl || params.gl !== gl) {
                    createButton(gl);
                }
            });
        });
        document.dispatchEvent(ev);
    }

    window.addEventListener('DOMContentLoaded', () => insertUI());
})();