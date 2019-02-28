export const immediateDownload = (
  name,
  dataStr,
  mime_type = 'application/json'
) => {
  const body = document.body;
  const blob = new Blob([dataStr], {
    type: mime_type,
  });

  const downloadLink = document.createElement('a');
  downloadLink.download = name;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.onclick = function(e) {
    // revokeObjectURL needs a delay to work properly
    setTimeout(() => {
      window.URL.revokeObjectURL(this.href);
    }, 1500);
  };
  body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
};
