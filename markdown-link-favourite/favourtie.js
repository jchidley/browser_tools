javascript:(function() {
  navigator.clipboard.writeText(
    `[${document.title}](${window.location.href})`
  )
  .then(() => alert('Copied to clipboard!'))
  .catch(err => alert('Failed to copy: ' + err));
})();