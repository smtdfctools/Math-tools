const expression = getParameterByName("expr")
const mj = function(tex) {
  return MathJax.tex2svg(tex, { em: 16, ex: 6, display: false });
}

var originalDivide = math.divide;
math.import({
  divide: function(a, b) {
    if (math.isZero(b)) {
      throw new Error('Divide by zero');
    }
    return originalDivide(a, b);
  }
}, { override: true })


function displayMathFormula(node, element) {
  try {
    const latex = node ? node.toTex({}) : ''
    MathJax.typesetClear();
    element.innerHTML = '';
    element.appendChild(mj(latex));
  }
  catch (err) {
    console.log(err);
  }
}

function parseExpr(expr) {
  let node = null

  try {
    node = math.parse(expr)
    return node
  }
  catch (err) {
    console.log(err);
  }
}

function calc(expr) {
  let node = null
  try {
    node = math.parse(expr, { implicit: 'hide' })
    node = math.simplify(node)
    return node
  }
  catch (err) {

    return err
  }
}

Turtle.component("tool-contents", function($) {
  $.onRender = function() {
    
  }
  
  $.onDrawBtnClick = function(){
    functionPlot({
      target: '#graph',
      disableZoom: false,
      
      data: [{
        
        fn: $.refs.expr.val,
        sampler: 'builtIn',
        graphType: 'polyline'
      }]
    })
  }
  

  return `
    <tool-nav></tool-nav>
    <h1>Draw Graph</h1>
    <br>
    <div class="bg-white shadow p-2">
      <div class="form-group">
        <label class="form-label">Function</label>
        <input type="text" class="form-input" ${Turtle.ref("expr")}>
      </div>
      <button class="btn btn-primary btn-sm" ${Turtle.events({click:$.onDrawBtnClick})}>Draw</button>
    </div>
    
    <div class="mt-5 bg-white shadow p-3">
      <h3>Graph</h3>
       <div id="graph" style="max-width:90vw; overflow-x:scroll;"></div>
       <div class="d-flex align-items-center justify-content-end">
        <button class="m-0 btn btn-sm btn-icon material-symbols-outlined" ${Turtle.events({click:$.shareBtnClick})}>share</button>
      </div>
    </div>

  `
})