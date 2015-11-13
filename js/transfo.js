var re_matrix = /^matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)$/;

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
var idM	= svg.createSVGMatrix();
idM.a=1; idM.b=0; idM.c=0; idM.d=1; idM.e=0; idM.f=0;

//______________________________________________________________________________________________________________________
function getMatrixFromString(str) {
    var res		= re_matrix.exec( str )
      , matrix	= svg.createSVGMatrix()
      ;
    matrix.a = parseFloat(res[1]) || 1;
    matrix.b = parseFloat(res[2]) || 0;
    matrix.c = parseFloat(res[3]) || 0;
    matrix.d = parseFloat(res[4]) || 1;
    matrix.e = parseFloat(res[5]) || 0;
    matrix.f = parseFloat(res[6]) || 0;

    return matrix;
}

//______________________________________________________________________________________________________________________
function getPoint(x, y) {
    var point = svg.createSVGPoint();
    point.x = x || 0;
    point.y = y || 0;
    return point;
}

//______________________________________________________________________________________________________________________
function getMatrixFromNode(node) {
	return getMatrixFromString( window.getComputedStyle(node).transform || "matrix(1,1,1,1,1,1)" );
}

//______________________________________________________________________________________________________________________
function dragNode( node
				 , originalMatrix, point_init_par_rapport_node
				 , currentMatrix
				 , x, y) {
	// TO BE DONE node.style.transform	= "matrix(0.5,0,0,0.5,0,0)"; cf multitouch.js
	
	// Create point + multiply matrice x point
	var e = x - originalMatrix.a*point_init_par_rapport_node.x - originalMatrix.c*point_init_par_rapport_node.y ;
	var f = y - originalMatrix.b*point_init_par_rapport_node.x - originalMatrix.d*point_init_par_rapport_node.y ;
	
	node.style.transform = "matrix("
							+ originalMatrix.a + ","
							+ originalMatrix.b + ","
							+ originalMatrix.c + ","
							+ originalMatrix.d + ","
							+ e + ","
							+ f + ")";
}

//______________________________________________________________________________________________________________________
function rotoZoomNode( node
					 , originalMatrix, currentMatrix
					 , pt_init_1, pt_current_1
					 , pt_init_2, pt_current_2
					 ) {
	
	var dx = pt_init_2.x - pt_init_1.x
	,	dy = pt_init_2.y - pt_init_1.y
	, 	dxp = pt_current_2.x - pt_current_1.x
	, 	dyp = pt_current_2.y - pt_current_1.y
	, 	s = undefined
	, 	c = undefined
	;

	if (dx === dy && dx === 0)
	{
		// Les points se confondent, on laisse 
		return console.error("Les points se confondent, on abondone");
	}
	else if (dx === 0 && dy !== 0)
	{
		s = -1 * dxp / dy ;
		c = dyp / dy;
	} else if (dx !== 0 && dy === 0)
	{
		s = dyp / dx ;
		c = dxp / dx;
	} else if (dx !== 0 && dy !== 0)
	{
		s = (dyp/dy - dxp/dx) / (dy/dx + dx/dy);
		c = (dxp + s*dy) / dx;
	}

	var e = pt_current_1.x - c*pt_init_1.x + s*pt_init_1.y;
	var f = pt_current_1.y - s*pt_init_1.x - c*pt_init_1.y;

	node.style.transform = "matrix("
							+ c + ","
							+ (-1*s) + ","
							+ e + ","
							+ s + ","
							+ c + ","
							+ f + ")";
}

//______________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________
//______________________________________________________________________________________________________________________
module.exports = {
    getMatrixFromNode	: getMatrixFromNode,
	getMatrixFromString : getMatrixFromString,
    getPoint            : getPoint,
	dragNode			: dragNode,
	rotoZoomNode		: rotoZoomNode,
	copyMatrix			: function(M) {return M.multiply(idM);}
};
