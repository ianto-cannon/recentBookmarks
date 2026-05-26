function walk(node, out = [], path = []) {
  if (!node) return out;
  if (node.title.includes("New folder")) {
    return out;
  }
  const currentPath = node.url ? path : [...path, node.title];
  if (node.url) {
    out.push({
      url: node.url,
      dateAdded: node.dateAdded,
      path: [...path, node.title].join("/")
      //path: node.title
    });
  }
  (node.children || []).forEach(child => {
    walk(child, out, currentPath);
  });
  return out;
}
chrome.bookmarks.getTree((tree) => {
  let items = [];
  tree.forEach(root => walk(root, items));
  console.dir(items)
  items.sort((a, b) => b.dateAdded - a.dateAdded);
  console.log('sort')
  console.dir(items)
  const container = document.getElementById("list");
  container.innerHTML = "";
  for (const item of items) {
    const row = document.createElement("div");
    const date = document.createElement("span");
    const d = new Date(item.dateAdded);
    date.textContent = 
      `${d.getFullYear()} ` +
      `${d.toLocaleString("en", { month: "short" })} ` +
      `${String(d.getDate()).padStart(2, "0")} ` +
      `${String(d.getHours()).padStart(2, "0")}:` +
      `${String(d.getMinutes()).padStart(2, "0")}` + 
      "  ";
    row.appendChild(date);
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.url;;//path;
    row.appendChild(link);
    const path = document.createElement("span");
    path.textContent =  "  " + item.path;
    row.appendChild(path);
    container.appendChild(row);
  }
});
