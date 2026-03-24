from pathlib import Path
path = Path('index.html')
data = path.read_text()
start = data.index('      <section id="about"')
footer_idx = data.index('      <footer class="site-footer">', start)
link_block = "      <div class=\"legal-links\">\n        <p>Read the <a href=\"/legal\">full About, Privacy, and Terms</a> page.</p>\n      </div>\n"
data = data[:start] + link_block + data[footer_idx:]
# update footer anchors
old = '<a href="#about">About</a><span>·</span>\n          <a href="#privacy">Privacy</a><span>·</span>\n          <a href="#terms">Terms</a><span>·</span>\n          <a href="mailto:tapan@monctonmorning.ca">Contact</a>'
new = '<a href="/legal#about">About</a><span>·</span>\n          <a href="/legal#privacy">Privacy</a><span>·</span>\n          <a href="/legal#terms">Terms</a><span>·</span>\n          <a href="mailto:tapan@monctonmorning.ca">Contact</a>'
data = data.replace(old, new)
path.write_text(data)
