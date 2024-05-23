/*remove in production
save(new Blob(['<!DOCTYPE HTML>'+html.outerHTML], { type: 'text/html' }), location.pathname.split('/').pop())
*/
function save(blob, name, flag) {
    name = name || 'download';

    // Use native saveAs in IE10+
    if (typeof navigator !== "undefined") {
        if (/MSIE [1-9]\./.test(navigator.userAgent)) {
            alert('IE is unsupported before IE10');
            return;
        }
        if (navigator.msSaveOrOpenBlob) {
            // https://msdn.microsoft.com/en-us/library/hh772332(v=vs.85).aspx
            alert('will download using IE10+ msSaveOrOpenBlob');
            navigator.msSaveOrOpenBlob(blob, name);
            return;
        }
    }

    // Construct URL object from blob
    var win_url = window.URL || window.webkitURL || window;
    var url = win_url.createObjectURL(blob);

    // Use a.download in HTML5
    var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    if ('download'in a) {
        flag&&alert('Starting prompted download of auto-generated assets from '+window.location.href);
        a.href = url;
        a.download = name;
        a.dispatchEvent(new MouseEvent('click'));
        // Don't revoke immediately, as it may prevent DL in some browsers
        setTimeout(function() {
            win_url.revokeObjectURL(url);
        }, 500);
        return;
    }

    // Use object URL directly
    window.location.href = url;
    // Don't revoke immediately, as it may prevent DL in some browsers
    setTimeout(function() {
        win_url.revokeObjectURL(url);
    }, 500);
}
/*end*/
