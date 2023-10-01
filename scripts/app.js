async function init(key) {
  await loadTool(await import(`../tools/${key}/init.js`))
  addScript(`../tools/${key}/main.js`)
}

let name = getParameterByName("name")
if (!name) {
  document.querySelector(".overlay").innerHTML = `
    <div class="d-grid" style="place-content:center">
      <div class="mt-5 circle-loader loader-info"></div>
    </div>
  `
  document.querySelector(".overlay").classList.add("active")
  window.location = "https://smtdfctools.github.io"

} else {
  init(name)
}