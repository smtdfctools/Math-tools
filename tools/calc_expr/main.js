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

Turtle.component("math-expr-block", function($) {
  let expr = $.props.expr
  $.onRender = function() {

    displayMathFormula(
      parseExpr(expr),
      $.refs.expr.HTMLElement
    )

    let result = calc(expr)
    if (result instanceof Error) {
      $.refs.result.innerHTML = `
        <span class="color-danger">${result.message}</span>
      `
      return
    }
    displayMathFormula(
      result,
      $.refs.result.HTMLElement
    )
  }

  $.shareBtnClick = function() {
    
  }

  return `
  <div class="mt-3 p-3 shadow"  style="max-width:90vw;" >
    <div style="max-width:90vw; overflow-x:scroll;">
      <span class="" ${Turtle.ref("expr")}></span>
      <br><br>
      = <span class="m-4" ${Turtle.ref("result")}></span>
    </div>
    <div class="d-flex align-items-center justify-content-end" >
      <button class="m-0 btn btn-sm btn-icon material-symbols-outlined" ${Turtle.events({click:$.shareBtnClick})}>share</button>
    </div>
  </div>
  `
})

Turtle.component("tool-contents", function($) {
  $.onRender = function() {
    $.refs.exprInput.autofocus = true
  }

  $.addExprBlock = function(expr) {
    let exprBlock = document.createElement("math-expr-block")
    if (!expr) return
    document.querySelector("#b").classList.replace("d-grid", "d-none")
    exprBlock.props.expr = expr
    $.refs.list.addChild(exprBlock)
    exprBlock.scrollIntoView({ behavior: 'smooth' })
  }
  
  $.onRender = function(){
    if(expression) $.addExprBlock(expression)
  }
  
  $.onCalcButtonClick = function() {
    $.addExprBlock($.refs.exprInput.val)
    // window.scrollTo(0, document.documentElement.scrollHeight);
  }

  return `
    <tool-nav></tool-nav>
    <h3>Calculate expression</h3>
    <div style="margin-bottom:20rem"  ${Turtle.ref("list")}>
      <div id="b" class="d-grid" style="height:100vh;place-content:center">
        <i>Type expression to start</i>
      </div>
    </div>
    <div class=" bg-white shadow p-2 pos-fixed d-flex " style="width:100vw;bottom:0; left:0;">
      <input class="form-input" style="width:90vw;" placeholder="Input expression ..." autofocus="true" ${Turtle.ref("exprInput")}>
      <button class="mx-3 my-0 btn btn-primary material-symbols-outlined" ${Turtle.events({click:$. onCalcButtonClick})} >
         equal
      </button>
    </div>
  `
})