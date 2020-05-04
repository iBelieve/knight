#! /usr/bin/env node
function LispSymbol(name){this.name=name;return;}
function Keyword(name){this.name=name;return;}
function isTrue(value){return (value)===(true);}
function isFalse(value){return (value)===(false);}
function isTruthy(value){return ((value)!==(false))&&((value)!=(null));}
function isFalsy(value){return ((value)===(false))||((value)==(null));}
function not(value){return ((value)===(false))||((value)==(null));}
function isNil(value){return (value)==(null);}
function isNotNil(value){return (value)!=(null);}
function isSymbol(value){return (value)instanceof(LispSymbol);}
function isKeyword(value){return (value)instanceof(Keyword);}
function isBool(value){return ((typeof(value))===("boolean"))||((value)instanceof(Boolean));}
function isNumber(value){return ((typeof(value))===("number"))||((value)instanceof(Number));}
function isChar(value){return (((typeof(value))===("string"))||((value)instanceof(String)))&&((value.length)===(1));}
function isString(value){return ((typeof(value))===("string"))||((value)instanceof(String));}
function isList(value){return Array.isArray(value);}
function isEmpty(value){return (value.length)===(0);}
function isSingle(list){return isTruthy(isList(list))&&((list.length)===(1));}
function isNotEmpty(value){return isTruthy(isNotNil(value))&&((value.length)>(0));}
function list(...items){return [...items];}
function map(array,func){return array.map(func);}
function mapLast(array,func,lastFunc){return array.map((item,index)=>{if(isTruthy((index)===((array.length)-(1)))){return lastFunc(item);}else{if(isTruthy(isNil(func))){return item;}else{return func(item);}}});}
function append(list,...items){return [...list,...items];}
function concat(a,b){return (a)+(b);}
function isStringContains(string,substring){return string.includes(substring);}
function isStringPrefix(string,prefix){return string.startsWith(prefix);}
function isStringSuffix(string,prefix){return string.endsWith(prefix);}
function stringJoin(string,sep){return string.join(sep);}
function println(...args){return console.log(...args);}
function print(...args){for(let arg of args){process.stdout.write(arg);}}
function hashMap(){return new Map();}
function hashMapGet(map,key){return map.get(key);}
function hashMapSet(map,key,value){return map.set(key,value);}
function hashMapCopy(map){return new Map(map);}
function arrayCopy(array){return Array.from(array);}
function containsKey(map,key){return map.has(key);}
let internedSymbols=hashMap();
let internedKeywords=hashMap();
function stringToSymbol(string){if(isTruthy(not(containsKey(internedSymbols,string)))){hashMapSet(internedSymbols,string,new LispSymbol(string));}return hashMapGet(internedSymbols,string);}
function symbolToString(symbol){return symbol.name;}
function keywordToString(keyword){return keyword.name;}
function stringToKeyword(string){let substring=isStringPrefix(string,":")?string.substring(1):isStringSuffix(string,":")?string.substring(0,(string.length)-(1)):string;if(isTruthy(not(containsKey(internedKeywords,substring)))){hashMapSet(internedKeywords,substring,new Keyword(substring));}return hashMapGet(internedKeywords,substring);}
function first(list){return list[0];}
function second(list){return list[1];}
function third(list){return list[2];}
function fourth(list){return list[3];}
function skip1(list){return list.slice(1);}
function skip2(list){return list.slice(2);}
function splitLast(seq){return [seq.slice(0,(seq.length)-(1)),seq[(seq.length)-(1)]];}
function regex(str,flags){return new RegExp(str,flags);}
function error(msg){throw new Error(msg);}
function isTaggedList(value,tag){return isTruthy(isList(value))&&((first(value))===(tag));}
function repr(value){if(isNil(value)){return "nil";}else {return JSON.stringify(value);}}
function* grouped(seq,count){let i=0;while(true){if(isTruthy((i)<(seq.length))){{yield seq.slice(i,(i)+(count));i=(i)+(count);continue;}}else{return;}}}
function zip(...arrays){return map(first(arrays),(_,index)=>{return map(arrays,(array)=>{return array[index];});});}
function set(...values){return new Set(values);}
function isSetContains(set,value){return set.has(value);}
function box(value){if(isBool(value)){return new Boolean(value);}else if(isNumber(value)){return new Number(value);}else if(isString(value)){return new String(value);}else {return value;}}
function unbox(value){if(isTruthy(isNotNil(value))){return value.valueOf();}else{return null;}}
let symbolMeta=Symbol("meta");
function meta(value){return value[symbolMeta];}
function metaSet(value,meta){value[symbolMeta]=meta;return;}
function stringRepeat(str,count){return str.repeat(count);}
function makeStringReader(string){return {"input":string,"index":0,}}
let readerMacros=hashMap();
function readChar(reader){let char=reader.input[reader.index];reader.index=(reader.index)+(1);return char;}
function peekChar(reader){return reader.input[reader.index];}
function hasMore(reader){return (reader.index)<(reader.input.length);}
function isCharWhitespace(char){return isTruthy((char)===(" "))||isTruthy((char)===("\t"))||isTruthy((char)===("\n"))||((char)===(","));}
function isCharDigit(char){return isTruthy((char)>=("0"))&&((char)<=("9"));}
function isCharMacro(char){return containsKey(readerMacros,char);}
function takeUntil(reader,predicate){let startIndex=reader.index;let inputLength=reader.input.length;let index=reader.index;while(true){if(isTruthy(isTruthy((index)>=(inputLength))||(predicate(reader.input[index])))){{reader.index=index;return reader.input.substring(startIndex,index);}}else{index=(index)+(1);continue;}}}
function takeWhile(reader,predicate){return takeUntil(reader,(char)=>{return not(predicate(char));});}
function skipWhitespace(reader){while(true){takeWhile(reader,(char)=>{return isCharWhitespace(char);});if(isTruthy((peekChar(reader))===(";"))){{takeUntil(reader,(c)=>{return (c)===("\n");});continue;}}else{return;}}}
function readToken(reader){return concat(readChar(reader),takeUntil(reader,(c)=>{return isTruthy(isCharWhitespace(c))||(isCharMacro(c));}));}
function parseToken(token){if((token)===("nil")){return null;}else if((token)===("true")){return true;}else if((token)===("false")){return false;}else if(isTruthy(isStringPrefix(token,":"))||(isStringSuffix(token,":"))){return stringToKeyword(token);}else {return stringToSymbol(token);}}
function readNumber(reader){let string=readToken(reader);if(isTruthy(isStringContains(string,"."))){return parseFloat(string);}else{return parseInt(string);}}
function readCharacter(reader){let char=readToken(reader);if((char)===("newline")){return "\n";}else if((char)===("return")){return "\r";}else if((char)===("tab")){return "\t";}else if((char)===("space")){return " ";}else if((char.length)===(1)){return char;}else {return error(("Unrecognized char: '")+(char)+("'"));}}
function readQuote(reader){return list(stringToSymbol("quote"),read(reader));}
function readList(reader,firstChar){return readUntil(reader,")");}
function readArray(reader,firstChar){return readUntil(reader,"]");}
function readStruct(reader,firstChar){return list(stringToSymbol("dict"),...readUntil(reader,"}"));}
function readUnmatchedDelimiter(reader,firstChar){return error(concat("Unmatched delimiter: ",firstChar));}
function readString(reader,firstChar){let string="";while(true){let part=takeUntil(reader,(ch)=>{return isTruthy((ch)===("\""))||((ch)===("\\"));});let string2=concat(string,part);let char=readChar(reader);if(isNil(char)){return error("Unexpected EOF while reading string");}else if((char)===("\"")){return string2;}else if((char)===("\\")){let char=readChar(reader);let escapedChar=(()=>{if(isNil(char)){return error("Unexpected EOF while reading character escape");}else if((char)===("\"")){return char;}else if((char)===("\\")){return char;}else if((char)===("/")){return char;}else if((char)===("n")){return "\n";}else if((char)===("t")){return "\t";}else if((char)===("r")){return "\r";}else if((char)===("u")){return readUnicodeChar(reader);}else {return concat(error("Unrecognized character escape",char));}})();string=concat(string2,escapedChar);continue;}}}
function readUnicodeChar(reader){let a=readChar(reader);let b=readChar(reader);let c=readChar(reader);let d=readChar(reader);return String.fromCharCode(parseInt((a)+(b)+(c)+(d)));}
hashMapSet(readerMacros,"'",readQuote);
hashMapSet(readerMacros,"\\",readCharacter);
hashMapSet(readerMacros,"\"",readString);
hashMapSet(readerMacros,"(",readList);
hashMapSet(readerMacros,")",readUnmatchedDelimiter);
hashMapSet(readerMacros,"[",readArray);
hashMapSet(readerMacros,"]",readUnmatchedDelimiter);
hashMapSet(readerMacros,"{",readStruct);
hashMapSet(readerMacros,"}",readUnmatchedDelimiter);
function readUntil(reader,endChar){let results=list();while(true){skipWhitespace(reader);let char=peekChar(reader);if(isNil(char)){return "UNEXPECTED EOF";}else if((char)===(endChar)){readChar(reader);return results;}else {results=append(results,read(reader));continue;}}}
function read(reader){skipWhitespace(reader);let c=peekChar(reader);if(isCharDigit(c)){return readNumber(reader);}else if(isCharMacro(c)){let macro=hashMapGet(readerMacros,c);readChar(reader);return macro(reader,c);}else {return parseToken(readToken(reader));}}
function readMany(reader){let results=list();while(true){skipWhitespace(reader);if(isTruthy(hasMore(reader))){results=append(results,read(reader));continue;}else{return results;}}}
function stringToExpr(str){return read(makeStringReader(str));}
function stringToExprs(str){return readMany(makeStringReader(str));}
let jsKeywords=set("var","let","const");
let analyzeSpecials=hashMap();
function isFieldAccess(form){return isTruthy(isSymbol(form))&&(isStringPrefix(symbolToString(form),".-"));}
function isMethodCall(form){return isTruthy(isSymbol(form))&&(isStringPrefix(symbolToString(form),"."));}
function isSpecial(form){return isTruthy(isSymbol(form))&&(containsKey(analyzeSpecials,form));}
function makeEnv(){return {"variables":hashMap(),"recurVariables":null,}}
function childEnv(env){return {"variables":hashMapCopy(env.variables),"recurVariables":isNotNil(env.recurVariables)?arrayCopy(env.recurVariables):null,}}
function recurEnv(env){return {"variables":hashMapCopy(env.variables),"recurVariables":[],}}
function appendRecurVar(env,var$){return env.recurVariables.push(var$);}
function knightQuote(form){if(isSymbol(form)){return list(stringToSymbol("string->symbol"),symbolToString(form));}else if(isList(form)){return append(list(stringToSymbol("js/array")),map(knightQuote,form));}else {return form;}}
function ctxStatement(ctx){if(isTruthy((ctx)===(stringToKeyword("expr")))){return stringToKeyword("expr");}else{return stringToKeyword("statement");}}
function ctxReturn(ctx){if(isTruthy((ctx)===(stringToKeyword("statement")))){return stringToKeyword("statement");}else{return stringToKeyword("return");}}
function printReturn(ctx){if(isTruthy((ctx)===(stringToKeyword("return")))){return print("return ");}else{return;}}
function printEnd(ctx){if(isTruthy(isTruthy((ctx)===(stringToKeyword("return")))||((ctx)===(stringToKeyword("statement"))))){return print(";");}else{return;}}
function isJsKeyword(ident){return isSetContains(jsKeywords,ident);}
function sanitizeJsKeywords(ident){if(isTruthy(isJsKeyword(ident))){return concat(ident,"$");}else{return ident;}}
function replaceSpecialChars(ident){return ident.replace("!","").replace("->","-to-").replace(regex("^((contains|has).*)\\?$"),"$1").replace(regex("^(.*)\\?$"),"is-$1");}
function kebabcaseToCamelcase(ident){return sanitizeJsKeywords(replaceSpecialChars(ident).replace(regex("[-_]([a-zA-Z])","g"),(match,p1)=>{return p1.toUpperCase();}));}
function symbolToIdent(symbol){if((symbol)===(stringToSymbol("Symbol"))){return "LispSymbol";}else {return kebabcaseToCamelcase(symbolToString(symbol));}}
function defineVariable(env,symbol){let variables=env.variables;if(isTruthy(not(containsKey(variables,symbol)))){hashMapSet(variables,symbol,symbolToIdent(symbol));}return hashMapGet(variables,symbol);}
function resolveVariable(env,symbol){if(isTruthy(isStringPrefix(symbolToString(symbol),"js/"))){return symbolToString(symbol).substring(3);}else{let variables=env.variables;if(isTruthy(not(containsKey(variables,symbol)))){error(concat("Symbol not found: ",symbolToString(symbol)));}return hashMapGet(variables,symbol);}}
function emitModule(exprs){let env=makeEnv();for(let expr of exprs){if(isTruthy(isTaggedList(expr,stringToSymbol("defn")))){defineVariable(env,second(expr));}}emitMany(env,stringToKeyword("statement"),exprs,"\n");return println();}
function emit(env,ctx,form){if(isSymbol(form)){return emitVar(env,ctx,form);}else if(isList(form)){return emitList(env,ctx,form);}else {return emitLiteral(env,ctx,form);}}
function emitLiteral(env,ctx,form){printReturn(ctx);if(isKeyword(form)){print("stringToKeyword(",JSON.stringify(keywordToString(form)),")");}else {print(JSON.stringify(form));}return printEnd(ctx);}
function emitVar(env,ctx,symbol){let name=resolveVariable(env,symbol);printReturn(ctx);print(name);return printEnd(ctx);}
function emitList(env,ctx,form){let callable=first(form);let args=skip1(form);if(isFieldAccess(callable)){return emitField(env,ctx,callable,args);}else if(isMethodCall(callable)){return emitMethodcall(env,ctx,callable,args);}else if(isSpecial(callable)){return hashMapGet(analyzeSpecials,callable)(env,ctx,args);}else {return emitFuncall(env,ctx,callable,args);}}
function emitField(env,ctx,callable,args){let fieldName=symbolToString(callable).substring(2);let obj=first(args);printReturn(ctx);emit(env,stringToKeyword("expr"),obj);print(".",fieldName);return printEnd(ctx);}
function emitMethodcall(env,ctx,callable,args){let methodName=symbolToString(callable).substring(1);let obj=first(args);let methodArgs=skip1(args);printReturn(ctx);emit(env,stringToKeyword("expr"),obj);print(".",methodName,"(");emitMany(env,stringToKeyword("expr"),methodArgs,",");print(")");return printEnd(ctx);}
function emitFuncall(env,ctx,callable,args){printReturn(ctx);emit(env,stringToKeyword("expr"),callable);print("(");emitMany(env,stringToKeyword("expr"),args,",");print(")");return printEnd(ctx);}
function emitMany(env,ctx,forms,sep){if(isTruthy(isNotEmpty(forms))){let [rest,lastForm]=splitLast(forms);for(let form of rest){emit(env,ctxStatement(ctx),form);if(isTruthy(sep)){print(sep);}}return emit(env,ctx,lastForm);}else{return;}}
function emitDefn(env,ctx,args){if(isTruthy((ctx)!==(stringToKeyword("statement")))){error("Definitions cannot be used as expressions");}let funcName=defineVariable(env,first(args));let params=second(args);let rest=skip2(args);let docs=isTruthy(isString(first(rest)))&&(isNotEmpty(skip1(rest)))?first(rest):null;let body=docs?skip1(rest):rest;let funcEnv=childEnv(env);print("function ",funcName,"(");for(let [index,param]of params.entries()){if(isTruthy(isTaggedList(param,stringToSymbol("spread")))){print("...",defineVariable(funcEnv,second(param)));}else{print(defineVariable(funcEnv,param));}if(isTruthy((index)<((params.length)-(1)))){print(",");}}print("){");emitMany(funcEnv,stringToKeyword("return"),body,"");return print("}");}
hashMapSet(analyzeSpecials,stringToSymbol("defn"),emitDefn);
function emitSet(env,ctx,args){if(isTruthy((ctx)!==(stringToKeyword("statement")))){error("set! cannot be used as an expression");}let setter=first(args);let value=second(args);if(isSymbol(setter)){return emitSetVar(env,setter,value);}else if(isList(setter)){return emitSetter(env,setter,value);}else {return error(concat("Invalid setter: ",repr(setter)));}}
function emitSetter(env,setter,value){let callable=first(setter);let args=skip1(setter);if(isFieldAccess(callable)){return emitSetField(env,callable,args,value);}else if((callable)===(stringToSymbol("js/index"))){return emitSetIndex(env,args,value);}else {return error(concat("Invalid setter: ",repr(setter)));}}
function emitSetVar(env,symbol,value){let name=resolveVariable(env,symbol);print(".",name,"=");emit(env,stringToKeyword("expr"),value);return print(";");}
function emitSetField(env,symbol,args,value){let fieldName=symbolToString(symbol).substring(2);let obj=first(args);emit(env,stringToKeyword("expr"),obj);print(".",fieldName,"=");emit(env,stringToKeyword("expr"),value);return print(";");}
function emitSetIndex(env,args,value){let obj=first(args);let index=second(args);emit(env,stringToKeyword("expr"),obj);print("[");emit(env,stringToKeyword("expr"),index);print("]=");emit(env,stringToKeyword("expr"),value);return print(";");}
hashMapSet(analyzeSpecials,stringToSymbol("set!"),emitSet);
function emitReturn(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("Return can only be used as a statement");}if(isTruthy(isEmpty(args))){return print("return;");}else{return emit(env,stringToKeyword("return"),first(args));}}
hashMapSet(analyzeSpecials,stringToSymbol("js/return"),emitReturn);
function emitOp(op){return (env,ctx,args)=>{if(isTruthy(isEmpty(args))){error("Empty operator call");}printReturn(ctx);for(let [index,arg]of args.entries()){print("(");emit(env,stringToKeyword("expr"),arg);print(")");if(isTruthy((index)<((args.length)-(1)))){print(op);}}return printEnd(ctx);};}
hashMapSet(analyzeSpecials,stringToSymbol("js/and"),emitOp("&&"));
hashMapSet(analyzeSpecials,stringToSymbol("js/or"),emitOp("||"));
hashMapSet(analyzeSpecials,stringToSymbol("js/=="),emitOp("=="));
hashMapSet(analyzeSpecials,stringToSymbol("js/!="),emitOp("!="));
hashMapSet(analyzeSpecials,stringToSymbol("js/==="),emitOp("==="));
hashMapSet(analyzeSpecials,stringToSymbol("js/!=="),emitOp("!=="));
hashMapSet(analyzeSpecials,stringToSymbol("="),emitOp("==="));
hashMapSet(analyzeSpecials,stringToSymbol("!="),emitOp("!=="));
hashMapSet(analyzeSpecials,stringToSymbol(">"),emitOp(">"));
hashMapSet(analyzeSpecials,stringToSymbol("<"),emitOp("<"));
hashMapSet(analyzeSpecials,stringToSymbol("<="),emitOp("<="));
hashMapSet(analyzeSpecials,stringToSymbol(">="),emitOp(">="));
hashMapSet(analyzeSpecials,stringToSymbol("+"),emitOp("+"));
hashMapSet(analyzeSpecials,stringToSymbol("-"),emitOp("-"));
hashMapSet(analyzeSpecials,stringToSymbol("*"),emitOp("*"));
hashMapSet(analyzeSpecials,stringToSymbol("/"),emitOp("/"));
hashMapSet(analyzeSpecials,stringToSymbol("mod"),emitOp("%"));
hashMapSet(analyzeSpecials,stringToSymbol("js/instanceof"),emitOp("instanceof"));
function emitSpread(env,ctx,args){if(isTruthy((ctx)!==(stringToKeyword("expr")))){error("Spread can only be used as an expression");}print("...");return emit(env,stringToKeyword("expr"),first(args));}
hashMapSet(analyzeSpecials,stringToSymbol("spread"),emitSpread);
function emitFor(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("For loop cannot be used as an expression. Use map instead");}let var$=first(first(args));let value=second(first(args));let body=skip1(args);let forEnv=childEnv(env);print("for(");if(isTruthy(isList(var$))){print("let [",stringJoin(map(var$,(var$)=>{return defineVariable(forEnv,var$);}),","),"]of ");}else{print("let ",defineVariable(forEnv,var$)," of ");}emit(forEnv,stringToKeyword("expr"),value);print("){");emitMany(forEnv,stringToKeyword("statement"),body,"");return print("}");}
hashMapSet(analyzeSpecials,stringToSymbol("for"),emitFor);
function emitDef(env,ctx,args){if(isTruthy((ctx)!==(stringToKeyword("statement")))){error("Definitions cannot be used as expressions");}let varName=defineVariable(env,first(args));let initForm=second(args);print("let ",varName,"=");if(isTruthy(initForm)){emit(env,stringToKeyword("expr"),initForm);}return print(";");}
hashMapSet(analyzeSpecials,stringToSymbol("def"),emitDef);
function emitIf(env,ctx,args){let test=first(args);let ifTrue=second(args);let ifFalse=skip2(args);if(isTruthy((ctx)===(stringToKeyword("expr")))){{emit(env,stringToKeyword("expr"),test);print("?");emit(env,stringToKeyword("expr"),ifTrue);print(":");if(isEmpty(ifFalse)){return print("null");}else if(isSingle(ifFalse)){return emit(env,stringToKeyword("expr"),first(ifFalse));}else {print("(");emitMany(env,stringToKeyword("expr"),ifFalse,",");return print(")");}}}else{{print("if(isTruthy(");emit(env,stringToKeyword("expr"),test);print(")){");emit(env,ctx,ifTrue);if(isTruthy(isNotEmpty(ifFalse))){{print("}else{");emitMany(env,ctx,ifFalse,"");return print("}");}}else{if(isTruthy((ctx)===(stringToKeyword("return")))){return print("}else{return;}");}else{return print("}");}}}}}
hashMapSet(analyzeSpecials,stringToSymbol("if"),emitIf);
function emitOr(env,ctx,args){if(isTruthy(isEmpty(args))){error("Empty operator expression: or");}printReturn(ctx);for(let [index,arg]of args.entries()){if(isTruthy((index)<((args.length)-(1)))){print("isTruthy");}print("(");emit(env,stringToKeyword("expr"),arg);print(")");if(isTruthy((index)<((args.length)-(1)))){print("||");}}return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("or"),emitOr);
function emitAnd(env,ctx,args){if(isTruthy(isEmpty(args))){error("Empty operator expression: and");}printReturn(ctx);for(let [index,arg]of args.entries()){if(isTruthy((index)<((args.length)-(1)))){print("isTruthy");}print("(");emit(env,stringToKeyword("expr"),arg);print(")");if(isTruthy((index)<((args.length)-(1)))){print("&&");}}return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("and"),emitAnd);
function emitLet(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("let cannot be used as an expressin currently");}let vars=first(args);let body=skip1(args);let letEnv=childEnv(env);for(let [var$,value]of grouped(vars,2)){if(isTruthy(isList(var$))){print("let [",stringJoin(map(var$,(var$)=>{return defineVariable(env,var$);}),","),"]=");}else{print("let ",defineVariable(env,var$),"=");}emit(env,stringToKeyword("expr"),value);print(";");}return emitMany(env,ctx,body,"");}
hashMapSet(analyzeSpecials,stringToSymbol("let"),emitLet);
function emitCond(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){print("(()=>{");}for(let [index,expr]of args.entries()){let test=first(expr);let body=skip1(expr);if(isTruthy((index)!==(0))){print("else ");}if(isTruthy((test)===(stringToSymbol("else")))){print("{");}else{{print("if(");emit(env,stringToKeyword("expr"),test);print("){");}}emitMany(env,ctxReturn(ctx),body,"");print("}");}if(isTruthy((ctx)===(stringToKeyword("expr")))){return print("})()");}else{return;}}
hashMapSet(analyzeSpecials,stringToSymbol("cond"),emitCond);
function emitDefgen(env,ctx,args){if(isTruthy((ctx)!==(stringToKeyword("statement")))){error("Definitions cannot be used as expressions");}let funcName=defineVariable(env,first(args));let params=second(args);let rest=skip2(args);let docs=isTruthy(isString(first(rest)))&&(isNotEmpty(skip1(rest)))?first(rest):null;let body=docs?skip1(rest):rest;let funcEnv=childEnv(env);print("function* ",funcName,"(");for(let [index,param]of params.entries()){if(isTruthy(isTaggedList(param,stringToSymbol("spread")))){print("...",defineVariable(funcEnv,second(param)));}else{print(defineVariable(funcEnv,param));}if(isTruthy((index)<((params.length)-(1)))){print(",");}}print("){");emitMany(funcEnv,stringToKeyword("return"),body,"");return print("}");}
hashMapSet(analyzeSpecials,stringToSymbol("defgen"),emitDefgen);
function emitLoop(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){print("(()=>{");}let vars=first(args);let body=skip1(args);let loopEnv=recurEnv(env);for(let [var$,value]of grouped(vars,2)){let name=defineVariable(loopEnv,var$);appendRecurVar(loopEnv,name);print("let ",name,"=");emit(loopEnv,stringToKeyword("expr"),value);print(";");}print("while(true){");emitMany(loopEnv,stringToKeyword("return"),body,"");print("}");if(isTruthy((ctx)===(stringToKeyword("expr")))){return print("})()");}else{return;}}
hashMapSet(analyzeSpecials,stringToSymbol("loop"),emitLoop);
function emitDo(env,ctx,args){print("{");emitMany(env,ctx,args,"");return print("}");}
hashMapSet(analyzeSpecials,stringToSymbol("do"),emitDo);
function emitYield(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("Yield can only be used as a statement");}print("yield ");emit(env,stringToKeyword("expr"),first(args));return print(";");}
hashMapSet(analyzeSpecials,stringToSymbol("yield"),emitYield);
function emitRecur(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("Recur can only be used as a statement");}for(let [var$,value]of zip(env.recurVariables,args)){print(var$,"=");emit(env,stringToKeyword("expr"),value);print(";");}return print("continue;");}
hashMapSet(analyzeSpecials,stringToSymbol("recur"),emitRecur);
function emitFn(env,ctx,args){printReturn(ctx);let params=first(args);let body=skip1(args);let funcEnv=childEnv(env);print("(");for(let [index,param]of params.entries()){if(isTruthy(isTaggedList(param,stringToSymbol("spread")))){print("...",defineVariable(funcEnv,second(param)));}else{print(defineVariable(funcEnv,param));}if(isTruthy((index)<((params.length)-(1)))){print(",");}}print(")=>{");emitMany(funcEnv,stringToKeyword("return"),body,"");print("}");return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("fn"),emitFn);
function emitQuote(env,ctx,args){return emit(env,ctx,knightQuote(first(args)));}
hashMapSet(analyzeSpecials,stringToSymbol("quote"),emitQuote);
function emitArray(env,ctx,args){printReturn(ctx);print("[");emitMany(env,stringToKeyword("expr"),args,",");print("]");return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("js/array"),emitArray);
function emitNew(env,ctx,args){let callable=first(args);let newArgs=skip1(args);printReturn(ctx);print("new ");emit(env,stringToKeyword("expr"),callable);print("(");emitMany(env,stringToKeyword("expr"),newArgs,",");print(")");return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("js/new"),emitNew);
function emitIndex(env,ctx,args){let obj=first(args);let index=second(args);printReturn(ctx);emit(env,stringToKeyword("expr"),obj);print("[");emit(env,stringToKeyword("expr"),index);print("]");return printEnd(ctx);}
hashMapSet(analyzeSpecials,stringToSymbol("js/index"),emitIndex);
function emitThrow(env,ctx,args){if(isTruthy((ctx)===(stringToKeyword("expr")))){error("throw cannot be used as an expression");}print("throw ");emit(env,stringToKeyword("expr"),first(args));return print(";");}
hashMapSet(analyzeSpecials,stringToSymbol("js/throw"),emitThrow);
function emitDict(env,ctx,args){printReturn(ctx);print("{");for(let [key,value]of grouped(args,2)){if(isTruthy(isKeyword(key))){print(JSON.stringify(kebabcaseToCamelcase(keywordToString(key))),":");}else{print(JSON.stringify(key),":");}emit(env,stringToKeyword("expr"),value);print(",");}print("}");return printEnd("}");}
hashMapSet(analyzeSpecials,stringToSymbol("dict"),emitDict);
let fs=require("fs");
let text=fs.readFileSync(0,"utf-8");println("#! /usr/bin/env node");emitModule(stringToExprs(text));
