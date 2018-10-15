export const immediateDownload = (dataStr, mime_type = 'application/json') => {
  const blob = new Blob([dataStr], {
    type: mime_type,
  });

  var dlink = document.createElement('a');
  dlink.download = 'manifest.json';
  dlink.href = window.URL.createObjectURL(blob);
  dlink.onclick = function(e) {
    // revokeObjectURL needs a delay to work properly
    var that = this;
    setTimeout(function() {
      window.URL.revokeObjectURL(that.href);
    }, 1500);
  };
  document.body.appendChild(dlink);
  dlink.click();
  dlink.remove();
  document.body.removeChild(dlink);
};
