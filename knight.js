function n(){return new Map}function t(n,t,e){return n.set(t,e)}function e(...n){return[...n]}function r(n){return o(u(Ln,n))&&t(Ln,n,new i(n)),c(Ln,n)}function o(n){return!1===n||null==n}function u(n,t){return n.has(t)}function i(n){this.name=n}function c(n,t){return n.get(t)}function l(n){{let e=a(n),i=function(n,e){f(n);{let l=m(n);if(g(l))return b(n);if(v(l)){let t=c($n,l);return x(n),t(n,l,e)}return"+"!==l&&"-"!==l||!g(m(n,1))?"nil"===(i=h(n))?null:"true"===i||"false"!==i&&(E(i,":")||w(i,":")?function(n){{let e=E(n,":")?n.substring(1):w(n,":")?n.substring(0,n.length-1):n;return o(u(Rn,e))&&t(Rn,e,new j(e)),c(Rn,e)}}(i):r(i)):b(n)}var i}(n,e),l=a(n);return y(i)&&function(n,t){n[Dn]=t}(i,{loc:{source:n.input,start:e,end:l}}),i}}function a(n){return{line:n.line,column:n.column}}function f(n){for(;;){if(s(n,n=>d(n)),";"!==m(n))return;p(n,n=>"\n"===n)}}function s(n,t){return p(n,n=>o(t(n)))}function p(n,t){{let e=n.index,r=n.input.length;{let o=n.index,u=n.line,i=n.column;for(;;){let c=n.input[o];if(o>=r||t(c))return n.index=o,n.line=u,n.column=i,n.input.substring(e,o);if("\n"===c){o+=1,u+=1,i=0;continue}o+=1,u=u,i+=1;continue}}}}function d(n){return" "===n||"\t"===n||"\n"===n||","===n}function m(n,t){return n.input[y(t)?n.index+t:n.index]}function y(n){return null!=n}function g(n){return n>="0"&&n<="9"}function b(n){{let t=h(n);return function(n,t){return n.includes(t)}(t,".")?parseFloat(t):parseInt(t)}}function h(n){return S(x(n),p(n,n=>d(n)||v(n)))}function S(n,t){return n+t}function x(n){{let t=n.input[n.index];return n.index=n.index+1,"\n"===t?(n.line=n.line+1,n.column=0):n.column=n.column+1,t}}function v(n){return u($n,n)}function E(n,t){return n.startsWith(t)}function w(n,t){return n.endsWith(t)}function j(n){this.name=n}function I(n){return function(n){return q(n)||N(n)||k(n)||A(n)}(n)?n:F(n)?e(r("quote"),n):B(n,r("unquote"))?M(n):C(n)?e(r("list"),...U(n,I)):e(r("quote"),n)}function q(n){return"boolean"==typeof n||n instanceof Boolean}function N(n){return"number"==typeof n||n instanceof Number}function k(n){return"string"==typeof n||n instanceof String}function A(n){return n instanceof j}function F(n){return n instanceof i}function B(n,t){return C(n)&&V(n)===t}function C(n){return Array.isArray(n)}function V(n){return n[0]}function M(n){return n[1]}function U(n,t){return n.map(t)}function W(n){throw new Error(n)}function O(n){return null==n}function L(n){{let t=x(n),e=x(n),r=x(n),o=x(n);return String.fromCharCode(parseInt(t+e+r+o))}}function R(n,t,r){{let u=!1,i=n.index-1,c=r.line,s=r.column;{let p=e();for(;;){if(o(u)){let e=a(n);f(n);{let r=a(n),o=r.line,l=r.column;o>c&&l<=s&&(u=!0,D(n,i,t,e))}}{let e=m(n);if(O(e))return $(n,i,r,t);if(e===t)return x(n),p;p=Z(p,l(n));continue}}}}}function D(n,t,e,r){return n.indentWarnings.push({startIndex:t,endChar:e,pos:r})}function $(n,t,e,r){{let i=(o=n.indentWarnings,u=n=>n.startIndex>=t,o.find(u));return console.error(i),W("Unexpected EOF, expected: '"+r+"'\n\nStarted here:\n"+z(n.input,e)+"\n\nBased on indent:\n"+z(n.input,i.pos))}var o,u}function z(n,t){{let e=t.line-1,r=e-1,o=e+1,u=n.split("\n"),i=u[e],c=u[r]||"",l=u[o]||"",a=S(P(" ",t.column),"^"),f=J(e+1),s=J(r+1),p=J(o+1),d=function(...n){return Math.max(...n)}(f.length,s.length,p.length);return Y(s,d)+" "+c+"\n"+Y(f,d)+" "+i+"\n"+P(" ",d)+" "+a+"\n"+Y(p,d)+" "+l}}function P(n,t){return n.repeat(t)}function J(n){return O(n)?"nil":k(n)?n:N(n)||q(n)?n.toString():T(n)}function T(n){return O(n)?"nil":F(n)?G(n):C(n)?"("+function(n,t){return n.join(t)}(U(n,T)," ")+")":JSON.stringify(n)}function G(n){return n.name}function Y(n,t,e){return n.padStart(t,e)}function Z(n,...t){return[...n,...t]}function _(n,t){return W(S("Unmatched delimiter: ",t))}function H(n){return n===r("Symbol")?"LispSymbol":function(n){return function(n,t){return n.has(t)}(zn,n)}(t=K(G(n)))?S(t,"$"):t;var t}function K(n){return function(n){return n.replace("!","").replace("->","-to-").replace(Q("^((contains|has).*)\\?$"),"$1").replace(Q("^(.*)\\?$"),"is-$1")}(n).replace(Q("[-_]([a-zA-Z])","g"),(n,t)=>t.toUpperCase())}function Q(n,t){return new RegExp(n,t)}function X(n){return n.slice(2)}function nn(n){return y(n)&&n.length>0}function tn(n){return n.slice(1)}function en(n){return{variables:rn(n.variables),loopVariables:n.loopVariables,functions:n.functions,functionNodes:n.functionNodes,isLoop:!1}}function rn(n){return new Map(n)}function on(n,e,r){{let o=n.functions;return u(o,e)?W("Function already defined: "+G(e)):t(o,e,r),null}}function un(n,e){{let i=n.variables,l=n.functions,a=n.functionNodes,f=G(e),s=cn(e)?cn(e).loc:void 0;return E(f,"js/")?{type:"Identifier",name:f.substring(3),originalName:f,loc:s}:u(i,e)?{type:"Identifier",name:c(i,e),originalName:f,loc:s}:u(l,e)?(o(u(a,e))&&function(n,e){{let o=en(n);t(n.functionNodes,e.name,r("placeholder")),t(n.functionNodes,e.name,{type:"FunctionDeclaration",id:{type:"Identifier",name:e.ident,originalName:G(e.name),loc:cn(e.name).loc},params:ln(o,e.params),body:pn(o,e.body),generator:e.generator,loc:e.loc})}}(n,c(l,e)),{type:"Identifier",name:c(l,e).ident,originalName:f,loc:s}):sn(e,"Variable or function not found: "+f+" - "+U(Array.from(i.keys()),G)+" - "+U(Array.from(l.keys()),G))}}function cn(n){return n[Dn]}function ln(n,t){return U(t,t=>an(n,t))}function an(n,t){return F(t)?fn(n,t):B(t,r("spread"))?{type:"RestElement",argument:fn(n,M(t)),loc:cn(t).loc}:C(t)?{type:"ArrayPattern",elements:ln(n,t)}:sn(t,"Unrecognized pattern")}function fn(n,e){{let r=n.variables;return o(u(r,e))&&t(r,e,H(e)),n.isLoop&&n.loopVariables.push(e),un(n,e)}}function sn(n,t){if(cn(n)&&cn(n).loc){let e=cn(n).loc;return W(t+"\n\n"+z(e.source,e.start))}return W(t)}function pn(n,t){return{type:"BlockStatement",body:dn(n,t)}}function dn(n,t){return mn(yn(t,t=>gn(n,t),t=>function(n,t){{let e=bn(n,t);return xn(e)?{type:"ReturnStatement",argument:e,loc:e.loc}:vn(e)}}(n,t)))}function mn(n){return function(n,t){return n.filter(t)}(n,n=>y(n))}function yn(n,t,e){return n.map((r,o)=>o===n.length-1?e(r):O(t)?r:t(r))}function gn(n,t){{let e=bn(n,t);return O(e)?e:xn(e)?{type:"ExpressionStatement",expression:e,loc:e.loc}:e}}function bn(n,t){return F(t)?function(n,t){return un(n,t)}(n,t):C(t)?function(n,t){{let e=cn(t)?cn(t).loc:void 0,r=V(t),o=tn(t);return hn(r)?function(n,t,e,r){{let o=G(e).substring(2),u=V(r);return{type:"MemberExpression",object:Sn(n,u),property:{type:"Identifier",name:o,loc:cn(e).loc},computed:!1,loc:t}}}(n,e,r,o):function(n){return F(n)&&E(G(n),".")}(r)?function(n,t,e,r){{let o=G(e).substring(1),u=V(r),i=tn(r);return{type:"CallExpression",callee:{type:"MemberExpression",object:Sn(n,u),property:{type:"Identifier",name:o,loc:cn(e).loc},computed:!1},arguments:jn(n,i),loc:t}}}(n,e,r,o):function(n){return F(n)&&u(Pn,n)}(r)?c(Pn,r)(n,e,o):function(n,t,e,r){return{type:"CallExpression",callee:Sn(n,e),arguments:jn(n,r),loc:t}}(n,e,r,o)}}(n,t):qn(n,t)}function hn(n){return F(n)&&E(G(n),".-")}function Sn(n,t){{let e=bn(n,t);return O(e)||xn(e)?e:function(n){return function(n){return{type:"CallExpression",callee:{type:"ArrowFunctionExpression",id:null,params:[],body:{type:"BlockStatement",body:[vn(n)],loc:n.loc}},arguments:[]}}(n)}(e)}}function xn(n){{let t=n.type;return"Literal"===t||"Identifier"===t||w(t,"Expression")||w(t,"Element")}}function vn(n){{let t=n.type;return"ReturnStatement"===t||"ForOfStatement"===t||"ContinueStatement"===t||"ThrowStatement"===t?n:"ExpressionStatement"===t?{type:"ReturnStatement",argument:n.expression,loc:n.loc}:"BlockStatement"===t?{type:"BlockStatement",body:En(n.body),loc:n.loc}:"WhileStatement"===t?{type:"WhileStatement",test:n.test,body:vn(n.body),loc:n.loc}:"IfStatement"===t?{type:"IfStatement",test:n.test,consequent:vn(n.consequent),alternate:n.alternate?vn(n.alternate):null,loc:n.loc}:W(S("Unsupported return statement: ",t))}}function En(n){return wn(n)?[{type:"ReturnStatement",argument:null}]:yn(n,null,vn)}function wn(n){return 0===n.length}function jn(n,t){return In(t,t=>Sn(n,t))}function In(n,t){return mn(U(n,t))}function qn(n,t){return void 0===t?W("Undefined!"):A(t)?bn(n,e(r("string->keyword"),Nn(t))):N(o=t)&&o<0?{type:"UnaryExpression",operator:"-",prefix:!0,argument:{type:"Literal",value:kn(An(t))},loc:y(t)&&cn(t)?cn(t).loc:void 0}:{type:"Literal",value:An(t),loc:y(t)&&cn(t)?cn(t).loc:void 0};var o}function Nn(n){return n.name}function kn(n){return-1*n}function An(n){return y(n)?n.valueOf():null}function Fn(n){return(t,e,r)=>(wn(r)&&W("Empty operator expression"),jn(t,r).reduce((t,r)=>({type:"BinaryExpression",operator:n,left:t,right:r,loc:e})))}function Bn(n,t){return function(n){return C(n)&&1===n.length}(t)?gn(n,V(t)):{type:"BlockStatement",body:Cn(n,t)}}function Cn(n,t){return In(t,t=>gn(n,t))}function Vn(n,t){return{type:"VariableDeclaration",kind:"let",declarations:U(Array.from(Mn(t,2)),t=>({type:"VariableDeclarator",id:fn(n,V(t)),init:Sn(n,M(t))})),loc:cn(t).loc}}function*Mn(n,t){{let e=0;for(;;){if(!(e<n.length))return;yield n.slice(e,e+t),e+=t}}}function Un(...n){return U(V(n),(t,e)=>U(n,n=>n[e]))}function Wn(n){return F(n)?e(r("string->symbol"),G(n)):C(n)?e(r("js/array"),...U(n,Wn)):n}function On(n){return n.index<n.input.length}let Ln=n(),Rn=n(),Dn=Symbol("meta"),$n=n();t($n,"'",(function(n,t,o){return e(r("quote"),l(n))})),t($n,"`",(function(n,t,e){return I(l(n))})),t($n,"&",(function(n,t,o){return e(r("spread"),l(n))})),t($n,"~",(function(n,t,o){return e(r("unquote"),l(n))})),t($n,"\\",(function(n){{let t=h(n);return"newline"===t?"\n":"return"===t?"\r":"tab"===t?"\t":"space"===t?" ":1===t.length?t:W("Unrecognized char: '"+t+"'")}})),t($n,'"',(function(n,t,e){{let t="";for(;;){let e=S(t,p(n,n=>'"'===n||"\\"===n)),r=x(n);if(O(r))return W("Unexpected EOF while reading string");if('"'===r)return e;if("\\"===r){let r=x(n),o=O(r)?W("Unexpected EOF while reading character escape"):'"'===r||"\\"===r||"/"===r?r:"n"===r?"\n":"t"===r?"\t":"r"===r?"\r":"u"===r?L(n):S(W("Unrecognized character escape"));t=S(e,o);continue}}}})),t($n,"(",(function(n,t,e){return R(n,")",e)})),t($n,")",_),t($n,"[",(function(n,t,e){return R(n,"]",e)})),t($n,"]",_),t($n,"{",(function(n,t,o){return e(r("dict"),...R(n,"}",o))})),t($n,"}",_);let zn=function(...n){return new Set(n)}("var","let","const"),Pn=n();t(Pn,r("defn"),(function(n,t,e){{let r=V(e),o=H(r),u=M(e),i=X(e),c=k(V(i))&&nn(tn(i))?V(i):void 0,l=c?tn(i):i;en(n);return on(n,r,{name:r,ident:o,params:u,docs:c,body:l,loc:t,generator:!1})}})),t(Pn,r("defgen"),(function(n,t,e){{let r=V(e),o=H(r),u=M(e),i=X(e),c=k(V(i))&&nn(tn(i))?V(i):void 0,l=c?tn(i):i;en(n);return on(n,r,{name:r,ident:o,params:u,docs:c,body:l,loc:t,generator:!0})}})),t(Pn,r("set!"),(function(n,t,e){{let o=V(e),u=M(e);return F(o)?function(n,t,e,r){return{type:"AssignmentExpression",operator:"=",left:un(n,e),right:Sn(n,r),loc:t}}(n,t,o,u):C(o)?function(n,t,e,o){{let u=V(e),i=tn(e);return hn(u)?function(n,t,e,r,o){{let u=G(e).substring(2),i=V(r);return{type:"AssignmentExpression",operator:"=",left:{type:"MemberExpression",object:Sn(n,i),property:{type:"Identifier",name:u,loc:cn(e).loc},computed:!1},right:Sn(n,o),loc:t}}}(n,t,u,i,o):u===r("nth")?function(n,t,e,r){{let o=V(e),u=M(e);return{type:"AssignmentExpression",operator:"=",left:{type:"MemberExpression",object:Sn(n,o),property:Sn(n,u),computed:!0},right:Sn(n,r),loc:t}}}(n,t,i,o):W(S("Invalid setter: ",T(e)))}}(n,t,o,u):W(S("Invalid setter: ",T(o)))}})),t(Pn,r("and"),Fn("&&")),t(Pn,r("or"),Fn("||")),t(Pn,r("js/and"),Fn("&&")),t(Pn,r("js/or"),Fn("||")),t(Pn,r("js/==="),Fn("===")),t(Pn,r("js/!=="),Fn("!==")),t(Pn,r("js/=="),Fn("==")),t(Pn,r("js/!="),Fn("!=")),t(Pn,r("="),Fn("===")),t(Pn,r("!="),Fn("!==")),t(Pn,r(">="),Fn(">=")),t(Pn,r("<="),Fn("<=")),t(Pn,r(">"),Fn(">")),t(Pn,r("<"),Fn("<")),t(Pn,r("+"),Fn("+")),t(Pn,r("-"),Fn("-")),t(Pn,r("*"),Fn("*")),t(Pn,r("/"),Fn("/")),t(Pn,r("mod"),Fn("%")),t(Pn,r("js/instanceof"),Fn("instanceof")),t(Pn,r("spread"),(function(n,t,e){return{type:"SpreadElement",argument:Sn(n,V(e)),loc:t}})),t(Pn,r("js/array"),(function(n,t,e){return{type:"ArrayExpression",elements:jn(n,e),loc:t}})),t(Pn,r("fn"),(function(n,t,e){{let r=V(e),o=tn(e),u=en(n);return{type:"ArrowFunctionExpression",id:null,params:ln(u,r),body:pn(u,o),loc:t}}})),t(Pn,r("if"),(function(n,t,e){{let r=V(e),o=M(e),u=X(e);return{type:"IfStatement",test:Sn(n,r),consequent:gn(n,o),alternate:y(u)?Bn(n,u):void 0,loc:t}}})),t(Pn,r("for"),(function(n,t,e){{let r=V(V(e)),o=M(V(e)),u=tn(e),i=en(n);return{type:"ForOfStatement",left:an(i,r),right:Sn(i,o),body:Bn(i,u),loc:t}}})),t(Pn,r("def"),(function(n,t,e){return{type:"VariableDeclaration",kind:"let",declarations:[{type:"VariableDeclarator",id:fn(n,V(e)),init:Sn(n,M(e)),loc:t}],loc:t}})),t(Pn,r("let"),(function(n,t,e){{let r=V(e),o=tn(e),u=en(n);return{type:"BlockStatement",body:[Vn(u,r),...Cn(u,o)],loc:t}}})),t(Pn,r("cond"),(function n(t,e,o){{let u=V(o),i=tn(o),c=V(u),l=tn(u);return c===r("else")?Bn(t,l):{type:"IfStatement",test:Sn(t,c),consequent:Bn(t,l),alternate:nn(i)?n(t,e,i):void 0}}})),t(Pn,r("loop"),(function(n,t,e){{let t=V(e),r=tn(e),o=function(n){return{variables:rn(n.variables),loopVariables:[],functions:n.functions,functionNodes:n.functionNodes,isLoop:!0}}(n);return wn(t)?{type:"WhileStatement",test:qn(o,!0),body:pn(o,r)}:{type:"BlockStatement",body:[Vn(o,t),{type:"WhileStatement",test:qn(o,!0),body:pn(o,r)}]}}})),t(Pn,r("do"),(function(n,t,e){return{type:"BlockStatement",body:Cn(n,e),loc:t}})),t(Pn,r("yield"),(function(n,t,e){return{type:"YieldExpression",argument:Sn(n,V(e)),loc:t}})),t(Pn,r("recur"),(function(n,t,e){return n.loopVariables.length!==e.length&&W("Recur with not enough args"+n.loopVariables.length+e.length),wn(e)?{type:"ContinueStatement",loc:t}:{type:"BlockStatement",body:[...U(Un(n.loopVariables,e),t=>({type:"ExpressionStatement",expression:{type:"AssignmentExpression",operator:"=",left:an(n,V(t)),right:Sn(n,M(t))}})),{type:"ContinueStatement"}],loc:t}})),t(Pn,r("dict"),(function(n,t,e){return{type:"ObjectExpression",properties:U(Array.from(Mn(e,2)),t=>({type:"Property",key:A(V(t))?qn(n,K(Nn(V(t)))):qn(n,V(t)),value:Sn(n,M(t))}))}})),t(Pn,r("quote"),(function(n,t,e){return bn(n,Wn(V(e)))})),t(Pn,r("js/return"),(function(n,t,e){return{type:"ReturnStatement",argument:nn(e)?Sn(n,V(e)):null,loc:t}})),t(Pn,r("js/throw"),(function(n,t,e){return{type:"ThrowStatement",argument:Sn(n,V(e)),loc:t}})),t(Pn,r("js/new"),(function(n,t,e){return{type:"NewExpression",callee:Sn(n,V(e)),arguments:jn(n,tn(e)),loc:t}})),t(Pn,r("nth"),(function(n,t,e){{let t=V(e),r=M(e);return{type:"MemberExpression",object:Sn(n,t),property:Sn(n,r),computed:!0}}})),require("source-map-support/register");let Jn=require("fs"),Tn=require("path"),Gn=require("escodegen"),Yn=require("terser"),Zn=require("commander").program;Zn.option("-o, --output <filename>","Output JS filename"),Zn.option("-m, --map","Generate source maps"),Zn.parse(process.argv);{let t=Zn.output,r=t?Tn.dirname(t):void 0,o=Zn.map?t?Tn.basename(t)+".map":"inline":void 0,u=Jn.readFileSync(0,"utf-8"),i=function(t){{let e={functions:n(),functionNodes:n(),variables:n(),isLoop:!1},r=Cn(e,t);return{type:"Program",body:[...e.functionNodes.values(),...r]}}}(function(n){{let t=e();for(;;){if(f(n),!On(n))return t;t=Z(t,l(n))}}}(function(n){return{input:n,index:0,line:1,column:0,indentWarnings:[]}}(u))),c=Gn.generate(i,{sourceMap:"stdin",sourceMapWithCode:!0,sourceContent:u}),a=c.map.toString(),s=Yn.minify(c.code,{toplevel:!0,sourceMap:o?{content:a,url:o}:void 0});s.error?console.error(s.error):t?(Jn.writeFileSync(t,s.code),o&&"inline"!==o&&Jn.writeFileSync(Tn.join(r,o),s.map.toString())):function(...n){console.log(...U(n,J))}(s.code)}
//# sourceMappingURL=knight.js.map