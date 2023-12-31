function onError() {
  
  document.getElementById("container").innerHTML = `
    <div class="text-align-center">
      <h1> Error ! </h1>
      <h3>This tool is inactive or under maintenance ! Please try again later </h3>
      <br><br>
    </div>
    <hr class="mt-5">
    <br>
    <div class="overflow-y-scroll" style="max-width:90vw;">
      <span>Tool name :${getParameterByName("name")}</span><br>
      <span>ID : ${getParameterByName("key")}</span><br>
      You found an error <a class="" href="https://smtdfc.github.io/#/help/report">report now</a>
    </div>
    `
}

async function init(key) {
  let c = await import(`../tools/${key}/init.js`)
  let process = await loadToolResources(c.requirements)
  process.onStatusChange = function(p) {
    document.querySelector("#progressbar>span").textContent = `${Math.round(process.precent)}%`
    document.getElementById("progressbar").style.width = `${process.precent}%`
  }

  process.onError = function() {
    onError()
  }

  process.onSuccess = function() {
    setTimeout(() => {
      document.getElementById("progressbar").remove()
    }, 1500)
    setTimeout(() => {
      addToolScript(key)
    },1000)
  }
  
  process.start()
}

function addToolScript(k){
  let script = document.createElement("script")
  script.src = `${window.dev?".":""}./tools/${k}/main.js`
  document.body.appendChild(script)
}

let name = getParameterByName("name") || window.dev

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
    .catch((err)=>{
      console.log(err);
    })
}