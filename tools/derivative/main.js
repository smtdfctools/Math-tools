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

function calc(expr, varName = "x") {
  let node = null
  try {
    node = math.parse(expr, { implicit: 'hide' })
    node = math.derivative(node, varName)
    return node
  }
  catch (err) {
    return err
  }
}

Turtle.component("tool-contents", function($) {
  let currentExpr = ""
  $.onRender = function() {
    if (expression) {
      currentExpr = expression
      $.onCalcBtnClick()
    }
  }
  
  $.onCalcBtnClick = function() {
    currentExpr = $.refs.expr.val
    displayMathFormula(
      calc(
        $.refs.expr.val,
        $.refs.variableName.val
      ),
      $.refs.result.HTMLElement
    )
  }

  $.shareBtnClick = function() {
    showShareModal(`https://smtdfctools.github.io/Math-tools/index.html?name=derivative&expr=${currentExpr}`)
  }

  return `
    <tool-nav></tool-nav>
    <h1>Derivative</h1>
    <br>
    <div class="bg-white shadow p-2">
      <div class="form-group">
        <label class="form-label">Function</label>
        <input type="text" class="form-input" ${Turtle.ref("expr")}>
      </div>
      <div class="form-group">
        <label class="form-label">Variable</label>
        <input  class="form-input" value="x" ${Turtle.ref("variableName")}>
      </div>
      <button class="btn btn-primary btn-sm" ${Turtle.events({click:$.onCalcBtnClick})}>Calculate</button>
    </div>
    
    <div class="mt-5 bg-white shadow p-3">
      <h3>Result</h3>
      <div ${Turtle.ref("result")}>
        - - -
      </div>
       <div class="d-flex align-items-center justify-content-end">
        <button class="m-0 btn btn-sm btn-icon material-symbols-outlined" ${Turtle.events({click:$.shareBtnClick})}>share</button>
      </div>
    </div>
  `
})