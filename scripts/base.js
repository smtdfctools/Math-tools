export async function load(config){
let process = await loadToolResources(config)
process.onStatusChange = function(p) {
  console.log(p);
  document.getElementById("progressbar").style.width = `${process.precent}%`
}

process.onError = function() {
/*  document.getElementById("container").innerHTML = `
    <div class="text-align-center">
      <h1> Error ! </h1>
      <h3>This tool is inactive or under maintenance ! Please try again later </h3>
      <br><br>
    </div>
    <hr class="mt-5">
    <br>
    <span>Tool name :${getParameterByName("name")}</span><br>
    <span>ID : ${getParameterByName("key")}</span><br>
    You found an error <a class="" href="https://smtdfc.github.io/#/help/report">report now</a>
    `*/
}

process.onSuccess = function() {
  setTimeout(() => {
    document.getElementById("progressbar").remove()
  }, 1500)
  setTimeout(() => { addScript(`./main.js`) })
}
process.start()
}