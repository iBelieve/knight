function n(){return new Map}function e(n,e,t){return n.set(e,t)}function t(...n){return[...n]}function r(n){return o(i(Ln,n))&&e(Ln,n,new u(n)),c(Ln,n)}function o(n){return!1===n||null==n}function i(n,e){return n.has(e)}function u(n){this.name=n}function c(n,e){return n.get(e)}function l(n){{let t=a(n),u=function(n,t){f(n);{let l=m(n);if(g(l))return b(n);if(v(l)){let e=c($n,l);return S(n),e(n,l,t)}return"+"!==l&&"-"!==l||!g(m(n,1))?"nil"===(u=h(n))?null:"true"===u||"false"!==u&&(E(u,":")||j(u,":")?function(n){{let t=E(n,":")?n.substring(1):j(n,":")?n.substring(0,n.length-1):n;return o(i(Rn,t))&&e(Rn,t,new w(t)),c(Rn,t)}}(u):r(u)):b(n)}var u}(n,t),l=a(n);return y(u)&&function(n,e){n[Dn]=e}(u,{loc:{source:n.input,start:t,end:l}}),u}}function a(n){return{line:n.line,column:n.column}}function f(n){for(;;){if(s(n,n=>d(n)),";"!==m(n))return;p(n,n=>"\n"===n)}}function s(n,e){return p(n,n=>o(e(n)))}function p(n,e){{let t=n.index,r=n.input.length;{let o=n.index,i=n.line,u=n.column;for(;;){let c=n.input[o];if(o>=r||e(c))return n.index=o,n.line=i,n.column=u,n.input.substring(t,o);if("\n"===c){o+=1,i+=1,u=0;continue}o+=1,i=i,u+=1;continue}}}}function d(n){return" "===n||"\t"===n||"\n"===n||","===n}function m(n,e){return n.input[y(e)?n.index+e:n.index]}function y(n){return null!=n}function g(n){return n>="0"&&n<="9"}function b(n){{let e=h(n);return function(n,e){return n.includes(e)}(e,".")?parseFloat(e):parseInt(e)}}function h(n){return x(S(n),p(n,n=>d(n)||v(n)))}function x(n,e){return n+e}function S(n){{let e=n.input[n.index];return n.index=n.index+1,"\n"===e?(n.line=n.line+1,n.column=0):n.column=n.column+1,e}}function v(n){return i($n,n)}function E(n,e){return n.startsWith(e)}function j(n,e){return n.endsWith(e)}function w(n){this.name=n}function I(n){return function(n){return q(n)||N(n)||k(n)||A(n)}(n)?n:F(n)?t(r("quote"),n):B(n,r("unquote"))?M(n):C(n)?t(r("list"),...U(n,I)):t(r("quote"),n)}function q(n){return"boolean"==typeof n||n instanceof Boolean}function N(n){return"number"==typeof n||n instanceof Number}function k(n){return"string"==typeof n||n instanceof String}function A(n){return n instanceof w}function F(n){return n instanceof u}function B(n,e){return C(n)&&V(n)===e}function C(n){return Array.isArray(n)}function V(n){return n[0]}function M(n){return n[1]}function U(n,e){return n.map(e)}function W(n){throw new Error(n)}function O(n){return null==n}function L(n){{let e=S(n),t=S(n),r=S(n),o=S(n);return String.fromCharCode(parseInt(e+t+r+o))}}function R(n,e,r){{let i=!1,u=n.index-1,c=r.line,s=r.column;{let p=t();for(;;){if(o(i)){let t=a(n);f(n);{let r=a(n),o=r.line,l=r.column;o>c&&l<=s&&(i=!0,D(n,u,e,t))}}{let t=m(n);if(O(t))return $(n,u,r,e);if(t===e)return S(n),p;p=Z(p,l(n));continue}}}}}function D(n,e,t,r){return n.indentWarnings.push({startIndex:e,endChar:t,pos:r})}function $(n,e,t,r){{let u=(o=n.indentWarnings,i=n=>n.startIndex>=e,o.find(i));return console.error(u),W("Unexpected EOF, expected: '"+r+"'\n\nStarted here:\n"+z(n.input,t)+"\n\nBased on indent:\n"+z(n.input,u.pos))}var o,i}function z(n,e){{let t=e.line-1,r=t-1,o=t+1,i=n.split("\n"),u=i[t],c=i[r]||"",l=i[o]||"",a=x(P(" ",e.column),"^"),f=J(t+1),s=J(r+1),p=J(o+1),d=function(...n){return Math.max(...n)}(f.length,s.length,p.length);return Y(s,d)+" "+c+"\n"+Y(f,d)+" "+u+"\n"+P(" ",d)+" "+a+"\n"+Y(p,d)+" "+l}}function P(n,e){return n.repeat(e)}function J(n){return O(n)?"nil":k(n)?n:N(n)||q(n)?n.toString():T(n)}function T(n){return O(n)?"nil":F(n)?G(n):C(n)?"("+function(n,e){return n.join(e)}(U(n,T)," ")+")":JSON.stringify(n)}function G(n){return n.name}function Y(n,e,t){return n.padStart(e,t)}function Z(n,...e){return[...n,...e]}function _(n,e){return W(x("Unmatched delimiter: ",e))}function H(n){return n===r("Symbol")?"LispSymbol":function(n){return function(n,e){return n.has(e)}(zn,n)}(e=K(G(n)))?x(e,"$"):e;var e}function K(n){return function(n){return n.replace("!","").replace("->","-to-").replace(Q("^((contains|has).*)\\?$"),"$1").replace(Q("^(.*)\\?$"),"is-$1")}(n).replace(Q("[-_]([a-zA-Z])","g"),(n,e)=>e.toUpperCase())}function Q(n,e){return new RegExp(n,e)}function X(n){return n.slice(2)}function nn(n){return y(n)&&n.length>0}function en(n){return n.slice(1)}function tn(n){return{variables:rn(n.variables),loopVariables:n.loopVariables,functions:n.functions,functionNodes:n.functionNodes,isLoop:!1}}function rn(n){return new Map(n)}function on(n,t,r){{let o=n.functions;return i(o,t)?W("Function already defined: "+G(t)):e(o,t,r),null}}function un(n,t){{let u=n.variables,l=n.functions,a=n.functionNodes,f=G(t),s=cn(t)?cn(t).loc:void 0;return E(f,"js/")?{type:"Identifier",name:f.substring(3),originalName:f,loc:s}:i(u,t)?{type:"Identifier",name:c(u,t),originalName:f,loc:s}:i(l,t)?(o(i(a,t))&&function(n,t){{let o=tn(n);e(n.functionNodes,t.name,r("placeholder")),e(n.functionNodes,t.name,{type:"FunctionDeclaration",id:{type:"Identifier",name:t.ident,originalName:G(t.name),loc:cn(t.name).loc},params:ln(o,t.params),body:pn(o,t.body),generator:t.generator,loc:t.loc})}}(n,c(l,t)),{type:"Identifier",name:c(l,t).ident,originalName:f,loc:s}):sn(t,"Variable or function not found: "+f+" - "+U(Array.from(u.keys()),G)+" - "+U(Array.from(l.keys()),G))}}function cn(n){return n[Dn]}function ln(n,e){return U(e,e=>an(n,e))}function an(n,e){return F(e)?fn(n,e):B(e,r("spread"))?{type:"RestElement",argument:fn(n,M(e)),loc:cn(e).loc}:C(e)?{type:"ArrayPattern",elements:ln(n,e)}:sn(e,"Unrecognized pattern")}function fn(n,t){{let r=n.variables;return o(i(r,t))&&e(r,t,H(t)),n.isLoop&&n.loopVariables.push(t),un(n,t)}}function sn(n,e){if(cn(n)&&cn(n).loc){let t=cn(n).loc;return W(e+"\n\n"+z(t.source,t.start))}return W(e)}function pn(n,e){return{type:"BlockStatement",body:dn(n,e)}}function dn(n,e){return mn(yn(e,e=>gn(n,e),e=>function(n,e){{let t=bn(n,e);return Sn(t)?{type:"ReturnStatement",argument:t,loc:t.loc}:vn(t)}}(n,e)))}function mn(n){return function(n,e){return n.filter(e)}(n,n=>y(n))}function yn(n,e,t){return n.map((r,o)=>o===n.length-1?t(r):O(e)?r:e(r))}function gn(n,e){{let t=bn(n,e);return O(t)?t:Sn(t)?{type:"ExpressionStatement",expression:t,loc:t.loc}:t}}function bn(n,e){return F(e)?function(n,e){return un(n,e)}(n,e):C(e)?function(n,e){{let t=cn(e)?cn(e).loc:void 0,r=V(e),o=en(e);return hn(r)?function(n,e,t,r){{let o=G(t).substring(2),i=V(r);return{type:"MemberExpression",object:xn(n,i),property:{type:"Identifier",name:o,loc:cn(t).loc},computed:!1,loc:e}}}(n,t,r,o):function(n){return F(n)&&E(G(n),".")}(r)?function(n,e,t,r){{let o=G(t).substring(1),i=V(r),u=en(r);return{type:"CallExpression",callee:{type:"MemberExpression",object:xn(n,i),property:{type:"Identifier",name:o,loc:cn(t).loc},computed:!1},arguments:wn(n,u),loc:e}}}(n,t,r,o):function(n){return F(n)&&i(Pn,n)}(r)?c(Pn,r)(n,t,o):function(n,e,t,r){return{type:"CallExpression",callee:xn(n,t),arguments:wn(n,r),loc:e}}(n,t,r,o)}}(n,e):qn(n,e)}function hn(n){return F(n)&&E(G(n),".-")}function xn(n,e){{let t=bn(n,e);return O(t)||Sn(t)?t:function(n){return function(n){return{type:"CallExpression",callee:{type:"ArrowFunctionExpression",id:null,params:[],body:{type:"BlockStatement",body:[vn(n)],loc:n.loc}},arguments:[]}}(n)}(t)}}function Sn(n){{let e=n.type;return"Literal"===e||"Identifier"===e||j(e,"Expression")||j(e,"Element")}}function vn(n){{let e=n.type;return"ReturnStatement"===e||"ForOfStatement"===e||"ContinueStatement"===e||"ThrowStatement"===e?n:"ExpressionStatement"===e?{type:"ReturnStatement",argument:n.expression,loc:n.loc}:"BlockStatement"===e?{type:"BlockStatement",body:En(n.body),loc:n.loc}:"WhileStatement"===e?{type:"WhileStatement",test:n.test,body:vn(n.body),loc:n.loc}:"IfStatement"===e?{type:"IfStatement",test:n.test,consequent:vn(n.consequent),alternate:n.alternate?vn(n.alternate):null,loc:n.loc}:W(x("Unsupported return statement: ",e))}}function En(n){return jn(n)?[{type:"ReturnStatement",argument:null}]:yn(n,null,vn)}function jn(n){return 0===n.length}function wn(n,e){return In(e,e=>xn(n,e))}function In(n,e){return mn(U(n,e))}function qn(n,e){return void 0===e?W("Undefined!"):A(e)?bn(n,t(r("string->keyword"),Nn(e))):N(o=e)&&o<0?{type:"UnaryExpression",operator:"-",prefix:!0,argument:{type:"Literal",value:kn(An(e))},loc:y(e)&&cn(e)?cn(e).loc:void 0}:{type:"Literal",value:An(e),loc:y(e)&&cn(e)?cn(e).loc:void 0};var o}function Nn(n){return n.name}function kn(n){return-1*n}function An(n){return y(n)?n.valueOf():null}function Fn(n){return(e,t,r)=>(jn(r)&&W("Empty operator expression"),wn(e,r).reduce((e,r)=>({type:"BinaryExpression",operator:n,left:e,right:r,loc:t})))}function Bn(n,e){return function(n){return C(n)&&1===n.length}(e)?gn(n,V(e)):{type:"BlockStatement",body:Cn(n,e)}}function Cn(n,e){return In(e,e=>gn(n,e))}function Vn(n,e){return{type:"VariableDeclaration",kind:"let",declarations:U(Array.from(Mn(e,2)),e=>({type:"VariableDeclarator",id:fn(n,V(e)),init:xn(n,M(e))})),loc:cn(e).loc}}function*Mn(n,e){{let t=0;for(;;){if(!(t<n.length))return;yield n.slice(t,t+e),t+=e}}}function Un(...n){return U(V(n),(e,t)=>U(n,n=>n[t]))}function Wn(n){return F(n)?t(r("string->symbol"),G(n)):C(n)?t(r("js/array"),...U(n,Wn)):n}function On(n){return n.index<n.input.length}let Ln=n(),Rn=n(),Dn=Symbol("meta"),$n=n();e($n,"'",(function(n,e,o){return t(r("quote"),l(n))})),e($n,"`",(function(n,e,t){return I(l(n))})),e($n,"&",(function(n,e,o){return t(r("spread"),l(n))})),e($n,"~",(function(n,e,o){return t(r("unquote"),l(n))})),e($n,"\\",(function(n){{let e=h(n);return"newline"===e?"\n":"return"===e?"\r":"tab"===e?"\t":"space"===e?" ":1===e.length?e:W("Unrecognized char: '"+e+"'")}})),e($n,'"',(function(n,e,t){{let e="";for(;;){let t=x(e,p(n,n=>'"'===n||"\\"===n)),r=S(n);if(O(r))return W("Unexpected EOF while reading string");if('"'===r)return t;if("\\"===r){let r=S(n),o=O(r)?W("Unexpected EOF while reading character escape"):'"'===r||"\\"===r||"/"===r?r:"n"===r?"\n":"t"===r?"\t":"r"===r?"\r":"u"===r?L(n):x(W("Unrecognized character escape"));e=x(t,o);continue}}}})),e($n,"(",(function(n,e,t){return R(n,")",t)})),e($n,")",_),e($n,"[",(function(n,e,t){return R(n,"]",t)})),e($n,"]",_),e($n,"{",(function(n,e,o){return t(r("dict"),...R(n,"}",o))})),e($n,"}",_);let zn=function(...n){return new Set(n)}("var","let","const"),Pn=n();e(Pn,r("defn"),(function(n,e,t){{let r=V(t),o=H(r),i=M(t),u=X(t),c=k(V(u))&&nn(en(u))?V(u):void 0,l=c?en(u):u;tn(n);return on(n,r,{name:r,ident:o,params:i,docs:c,body:l,loc:e,generator:!1})}})),e(Pn,r("defgen"),(function(n,e,t){{let r=V(t),o=H(r),i=M(t),u=X(t),c=k(V(u))&&nn(en(u))?V(u):void 0,l=c?en(u):u;tn(n);return on(n,r,{name:r,ident:o,params:i,docs:c,body:l,loc:e,generator:!0})}})),e(Pn,r("set!"),(function(n,e,t){{let o=V(t),i=M(t);return F(o)?function(n,e,t,r){return{type:"AssignmentExpression",operator:"=",left:un(n,t),right:xn(n,r),loc:e}}(n,e,o,i):C(o)?function(n,e,t,o){{let i=V(t),u=en(t);return hn(i)?function(n,e,t,r,o){{let i=G(t).substring(2),u=V(r);return{type:"AssignmentExpression",operator:"=",left:{type:"MemberExpression",object:xn(n,u),property:{type:"Identifier",name:i,loc:cn(t).loc},computed:!1},right:xn(n,o),loc:e}}}(n,e,i,u,o):i===r("js/index")?function(n,e,t,r){{let o=V(t),i=M(t);return{type:"AssignmentExpression",operator:"=",left:{type:"MemberExpression",object:xn(n,o),property:xn(n,i),computed:!0},right:xn(n,r),loc:e}}}(n,e,u,o):W(x("Invalid setter: ",T(t)))}}(n,e,o,i):W(x("Invalid setter: ",T(o)))}})),e(Pn,r("and"),Fn("&&")),e(Pn,r("or"),Fn("||")),e(Pn,r("js/and"),Fn("&&")),e(Pn,r("js/or"),Fn("||")),e(Pn,r("js/==="),Fn("===")),e(Pn,r("js/!=="),Fn("!==")),e(Pn,r("js/=="),Fn("==")),e(Pn,r("js/!="),Fn("!=")),e(Pn,r("="),Fn("===")),e(Pn,r("!="),Fn("!==")),e(Pn,r(">="),Fn(">=")),e(Pn,r("<="),Fn("<=")),e(Pn,r(">"),Fn(">")),e(Pn,r("<"),Fn("<")),e(Pn,r("+"),Fn("+")),e(Pn,r("-"),Fn("-")),e(Pn,r("*"),Fn("*")),e(Pn,r("/"),Fn("/")),e(Pn,r("mod"),Fn("%")),e(Pn,r("js/instanceof"),Fn("instanceof")),e(Pn,r("spread"),(function(n,e,t){return{type:"SpreadElement",argument:xn(n,V(t)),loc:e}})),e(Pn,r("js/array"),(function(n,e,t){return{type:"ArrayExpression",elements:wn(n,t),loc:e}})),e(Pn,r("fn"),(function(n,e,t){{let r=V(t),o=en(t),i=tn(n);return{type:"ArrowFunctionExpression",id:null,params:ln(i,r),body:pn(i,o),loc:e}}})),e(Pn,r("if"),(function(n,e,t){{let r=V(t),o=M(t),i=X(t);return{type:"IfStatement",test:xn(n,r),consequent:gn(n,o),alternate:y(i)?Bn(n,i):void 0,loc:e}}})),e(Pn,r("for"),(function(n,e,t){{let r=V(V(t)),o=M(V(t)),i=en(t),u=tn(n);return{type:"ForOfStatement",left:an(u,r),right:xn(u,o),body:Bn(u,i),loc:e}}})),e(Pn,r("def"),(function(n,e,t){return{type:"VariableDeclaration",kind:"let",declarations:[{type:"VariableDeclarator",id:fn(n,V(t)),init:xn(n,M(t)),loc:e}],loc:e}})),e(Pn,r("let"),(function(n,e,t){{let r=V(t),o=en(t),i=tn(n);return{type:"BlockStatement",body:[Vn(i,r),...Cn(i,o)],loc:e}}})),e(Pn,r("cond"),(function n(e,t,o){{let i=V(o),u=en(o),c=V(i),l=en(i);return c===r("else")?Bn(e,l):{type:"IfStatement",test:xn(e,c),consequent:Bn(e,l),alternate:nn(u)?n(e,t,u):void 0}}})),e(Pn,r("loop"),(function(n,e,t){{let e=V(t),r=en(t),o=function(n){return{variables:rn(n.variables),loopVariables:[],functions:n.functions,functionNodes:n.functionNodes,isLoop:!0}}(n);return jn(e)?{type:"WhileStatement",test:qn(o,!0),body:pn(o,r)}:{type:"BlockStatement",body:[Vn(o,e),{type:"WhileStatement",test:qn(o,!0),body:pn(o,r)}]}}})),e(Pn,r("do"),(function(n,e,t){return{type:"BlockStatement",body:Cn(n,t),loc:e}})),e(Pn,r("yield"),(function(n,e,t){return{type:"YieldExpression",argument:xn(n,V(t)),loc:e}})),e(Pn,r("recur"),(function(n,e,t){return n.loopVariables.length!==t.length&&W("Recur with not enough args"+n.loopVariables.length+t.length),jn(t)?{type:"ContinueStatement",loc:e}:{type:"BlockStatement",body:[...U(Un(n.loopVariables,t),e=>({type:"ExpressionStatement",expression:{type:"AssignmentExpression",operator:"=",left:an(n,V(e)),right:xn(n,M(e))}})),{type:"ContinueStatement"}],loc:e}})),e(Pn,r("dict"),(function(n,e,t){return{type:"ObjectExpression",properties:U(Array.from(Mn(t,2)),e=>({type:"Property",key:A(V(e))?qn(n,K(Nn(V(e)))):qn(n,V(e)),value:xn(n,M(e))}))}})),e(Pn,r("quote"),(function(n,e,t){return bn(n,Wn(V(t)))})),e(Pn,r("js/return"),(function(n,e,t){return{type:"ReturnStatement",argument:nn(t)?xn(n,V(t)):null,loc:e}})),e(Pn,r("js/throw"),(function(n,e,t){return{type:"ThrowStatement",argument:xn(n,V(t)),loc:e}})),e(Pn,r("js/new"),(function(n,e,t){return{type:"NewExpression",callee:xn(n,V(t)),arguments:wn(n,en(t)),loc:e}})),e(Pn,r("js/index"),(function(n,e,t){{let e=V(t),r=M(t);return{type:"MemberExpression",object:xn(n,e),property:xn(n,r),computed:!0}}})),require("source-map-support/register");let Jn=require("fs"),Tn=require("path"),Gn=require("escodegen"),Yn=require("terser"),Zn=require("commander").program;Zn.option("-o, --output <filename>","Output JS filename"),Zn.option("-m, --map","Generate source maps"),Zn.parse(process.argv);{let e=Zn.output,r=e?Tn.dirname(e):void 0,o=Zn.map?e?Tn.basename(e)+".map":"inline":void 0,i=Jn.readFileSync(0,"utf-8"),u=function(e){{let t={functions:n(),functionNodes:n(),variables:n(),isLoop:!1},r=Cn(t,e);return{type:"Program",body:[...t.functionNodes.values(),...r]}}}(function(n){{let e=t();for(;;){if(f(n),!On(n))return e;e=Z(e,l(n))}}}(function(n){return{input:n,index:0,line:1,column:0,indentWarnings:[]}}(i))),c=Gn.generate(u,{sourceMap:"stdin",sourceMapWithCode:!0,sourceContent:i}),a=c.map.toString(),s=Yn.minify(c.code,{toplevel:!0,sourceMap:o?{content:a,url:o}:void 0});s.error?console.error(s.error):e?(Jn.writeFileSync(e,s.code),o&&"inline"!==o&&Jn.writeFileSync(Tn.join(r,o),s.map.toString())):function(...n){console.log(...U(n,J))}(s.code)}
//# sourceMappingURL=knight.js.map