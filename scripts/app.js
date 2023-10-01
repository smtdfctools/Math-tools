function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let name = getParameterByName("name")
if(!name){
  document.querySelector(".overlay").innerHTML =`
    <div class="d-grid" style="place-content:center">
      <div class="mt-5 circle-loader loader-info"></div>
    </div>
  `
  document.querySelector(".overlay").classList.add("active")
  window.location ="https://smtdfctools.github.io"
}
async function loadTool(base,key){
  await import(`../tools/${key}/main.js`)
}