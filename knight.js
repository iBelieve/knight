function LispSymbol(name) {
    this.name = name;
    return;
}
function Keyword(name) {
    this.name = name;
    return;
}
function isTrue(value) {
    return value === true;
}
function isFalse(value) {
    return value === false;
}
function isTruthy(value) {
    return value !== false && value != null;
}
function isFalsy(value) {
    return value === false || value == null;
}
function not(value) {
    return value === false || value == null;
}
function isNil(value) {
    return value == null;
}
function isNotNil(value) {
    return value != null;
}
function isSymbol(value) {
    return value instanceof LispSymbol;
}
function isKeyword(value) {
    return value instanceof Keyword;
}
function isBool(value) {
    return typeof(value) === 'boolean' || value instanceof Boolean;
}
function isNumber(value) {
    return typeof(value) === 'number' || value instanceof Number;
}
function isChar(value) {
    return (typeof(value) === 'string' || value instanceof String) && value.length === 1;
}
function isString(value) {
    return typeof(value) === 'string' || value instanceof String;
}
function isList(value) {
    return Array.isArray(value);
}
function isEmpty(value) {
    return value.length === 0;
}
function isSingle(list) {
    return isList(list) && list.length === 1;
}
function isNotEmpty(value) {
    return isNotNil(value) && value.length > 0;
}
function list(...items) {
    return [...items];
}
function map(array, func) {
    return array.map(func);
}
function mapLast(array, func, lastFunc) {
    return array.map((item, index) => {
        if (index === array.length - 1)
            return lastFunc(item);
        else if (isNil(func))
            return item;
        else
            return func(item);
    });
}
function append(list, ...items) {
    return [
        ...list,
        ...items
    ];
}
function concat(a, b) {
    return a + b;
}
function isStringContains(string, substring) {
    return string.includes(substring);
}
function isStringPrefix(string, prefix) {
    return string.startsWith(prefix);
}
function isStringSuffix(string, prefix) {
    return string.endsWith(prefix);
}
function stringJoin(string, sep) {
    return string.join(sep);
}
function println(...args) {
    return console.log(...args);
}
function print(...args) {
    for (arg of args)
        process.stdout.write(arg);
}
function hashMap() {
    return new Map();
}
function hashMapGet(map, key) {
    return map.get(key);
}
function hashMapSet(map, key, value) {
    return map.set(key, value);
}
function hashMapCopy(map) {
    return new Map(map);
}
function arrayCopy(array) {
    return Array.from(array);
}
function containsKey(map, key) {
    return map.has(key);
}
let internedSymbols = hashMap();
let internedKeywords = hashMap();
function stringToSymbol(string) {
    if (not(containsKey(internedSymbols, string)))
        hashMapSet(internedSymbols, string, new LispSymbol(string));
    else {
    }
    return hashMapGet(internedSymbols, string);
}
function symbolToString(symbol) {
    return symbol.name;
}
function keywordToString(keyword) {
    return keyword.name;
}
function stringToKeyword(string) {
    {
        let substring = (() => {
            if (isStringPrefix(string, ':'))
                return string.substring(1);
            else if (isStringSuffix(string, ':'))
                return string.substring(0, string.length - 1);
            else
                return string;
        })();
        if (not(containsKey(internedKeywords, substring)))
            hashMapSet(internedKeywords, substring, new Keyword(substring));
        else {
        }
        return hashMapGet(internedKeywords, substring);
    }
}
function first(list) {
    return list[0];
}
function second(list) {
    return list[1];
}
function third(list) {
    return list[2];
}
function fourth(list) {
    return list[3];
}
function skip1(list) {
    return list.slice(1);
}
function skip2(list) {
    return list.slice(2);
}
function splitLast(seq) {
    return [
        seq.slice(0, seq.length - 1),
        seq[seq.length - 1]
    ];
}
function regex(str, flags) {
    return new RegExp(str, flags);
}
function error(msg) {
    throw new Error(msg);
}
function isTaggedList(value, tag) {
    return isList(value) && first(value) === tag;
}
function repr(value) {
    if (isNil(value))
        return 'nil';
    else
        return JSON.stringify(value);
}
function* grouped(seq, count) {
    {
        let i = 0;
        while (true) {
            if (i < seq.length) {
                yield seq.slice(i, i + count);
                {
                    i = i + count;
                    continue;
                }
            } else {
                return;
            }
        }
    }
}
function zip(...arrays) {
    return map(first(arrays), (_, index) => {
        return map(arrays, array => {
            return array[index];
        });
    });
}
function set(...values) {
    return new Set(values);
}
function isSetContains(set, value) {
    return set.has(value);
}
function box(value) {
    if (isBool(value))
        return new Boolean(value);
    else if (isNumber(value))
        return new Number(value);
    else if (isString(value))
        return new String(value);
    else
        return value;
}
function unbox(value) {
    if (isNotNil(value))
        return value.valueOf();
    else
        return null;
}
let symbolMeta = Symbol('meta');
function meta(value) {
    return value[symbolMeta];
}
function metaSet(value, meta) {
    value[symbolMeta] = meta;
    return;
}
function stringRepeat(str, count) {
    return str.repeat(count);
}
function makeStringReader(string) {
    return {
        'input': string,
        'index': 0
    };
}
let readerMacros = hashMap();
function readerPos(reader) {
    {
        let lineBreak = regex('\r\n?|\n', 'g');
        {
            let line = 1, cur = 0;
            while (true) {
                lineBreak.lastindex = cur;
                {
                    let match = lineBreak.exec(reader.input);
                    if (match && match.index < reader.index) {
                        line = line + 1;
                        cur = match.index + match[0].length;
                        continue;
                    } else
                        return {
                            'line': line,
                            'column': reader.index - cur
                        };
                }
            }
        }
    }
}
function readChar(reader) {
    {
        let char = reader.input[reader.index];
        reader.index = reader.index + 1;
        return char;
    }
}
function peekChar(reader) {
    return reader.input[reader.index];
}
function hasMore(reader) {
    return reader.index < reader.input.length;
}
function isCharWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\n' || char === ',';
}
function isCharDigit(char) {
    return char >= '0' && char <= '9';
}
function isCharMacro(char) {
    return containsKey(readerMacros, char);
}
function takeUntil(reader, predicate) {
    {
        let startIndex = reader.index, inputLength = reader.input.length;
        {
            let index = reader.index;
            while (true) {
                if (index >= inputLength || predicate(reader.input[index])) {
                    reader.index = index;
                    return reader.input.substring(startIndex, index);
                } else {
                    index = index + 1;
                    continue;
                }
            }
        }
    }
}
function takeWhile(reader, predicate) {
    return takeUntil(reader, char => {
        return not(predicate(char));
    });
}
function skipWhitespace(reader) {
    while (true) {
        takeWhile(reader, char => {
            return isCharWhitespace(char);
        });
        if (peekChar(reader) === ';') {
            takeUntil(reader, c => {
                return c === '\n';
            });
            continue;
        } else {
            return;
        }
    }
}
function readToken(reader) {
    return concat(readChar(reader), takeUntil(reader, c => {
        return isCharWhitespace(c) || isCharMacro(c);
    }));
}
function parseToken(token) {
    if (token === 'nil')
        return null;
    else if (token === 'true')
        return true;
    else if (token === 'false')
        return false;
    else if (isStringPrefix(token, ':') || isStringSuffix(token, ':'))
        return stringToKeyword(token);
    else
        return stringToSymbol(token);
}
function readNumber(reader) {
    {
        let string = readToken(reader);
        if (isStringContains(string, '.'))
            return parseFloat(string);
        else
            return parseInt(string);
    }
}
function readCharacter(reader) {
    {
        let char = readToken(reader);
        if (char === 'newline')
            return '\n';
        else if (char === 'return')
            return '\r';
        else if (char === 'tab')
            return '\t';
        else if (char === 'space')
            return ' ';
        else if (char.length === 1)
            return char;
        else
            return error('Unrecognized char: \'' + char + '\'');
    }
}
function readQuote(reader) {
    return list(stringToSymbol('quote'), read(reader));
}
function readList(reader, firstChar) {
    return readUntil(reader, ')');
}
function readArray(reader, firstChar) {
    return readUntil(reader, ']');
}
function readStruct(reader, firstChar) {
    return list(stringToSymbol('dict'), ...readUntil(reader, '}'));
}
function readUnmatchedDelimiter(reader, firstChar) {
    return error(concat('Unmatched delimiter: ', firstChar));
}
function readString(reader, firstChar) {
    {
        let string = '';
        while (true) {
            {
                let part = takeUntil(reader, ch => {
                        return ch === '"' || ch === '\\';
                    }), string2 = concat(string, part), char = readChar(reader);
                if (isNil(char))
                    return error('Unexpected EOF while reading string');
                else if (char === '"')
                    return string2;
                else if (char === '\\') {
                    let char = readChar(reader), escapedChar = (() => {
                            if (isNil(char))
                                return error('Unexpected EOF while reading character escape');
                            else if (char === '"')
                                return char;
                            else if (char === '\\')
                                return char;
                            else if (char === '/')
                                return char;
                            else if (char === 'n')
                                return '\n';
                            else if (char === 't')
                                return '\t';
                            else if (char === 'r')
                                return '\r';
                            else if (char === 'u')
                                return readUnicodeChar(reader);
                            else
                                return concat(error('Unrecognized character escape', char));
                        })();
                    {
                        string = concat(string2, escapedChar);
                        continue;
                    }
                }
            }
        }
    }
}
function readUnicodeChar(reader) {
    {
        let a = readChar(reader), b = readChar(reader), c = readChar(reader), d = readChar(reader);
        return String.fromCharCode(parseInt(a + b + c + d));
    }
}
hashMapSet(readerMacros, '\'', readQuote);
hashMapSet(readerMacros, '\\', readCharacter);
hashMapSet(readerMacros, '"', readString);
hashMapSet(readerMacros, '(', readList);
hashMapSet(readerMacros, ')', readUnmatchedDelimiter);
hashMapSet(readerMacros, '[', readArray);
hashMapSet(readerMacros, ']', readUnmatchedDelimiter);
hashMapSet(readerMacros, '{', readStruct);
hashMapSet(readerMacros, '}', readUnmatchedDelimiter);
function readUntil(reader, endChar) {
    {
        let results = list();
        while (true) {
            skipWhitespace(reader);
            {
                let char = peekChar(reader);
                if (isNil(char))
                    return error('Unexpected EOF, expected: ' + endChar);
                else if (char === endChar) {
                    readChar(reader);
                    return results;
                } else {
                    results = append(results, readSyntax(reader));
                    continue;
                }
            }
        }
    }
}
function read(reader) {
    skipWhitespace(reader);
    {
        let c = peekChar(reader);
        if (isCharDigit(c))
            return readNumber(reader);
        else if (isCharMacro(c)) {
            let macro = hashMapGet(readerMacros, c);
            readChar(reader);
            return macro(reader, c);
        } else
            return parseToken(readToken(reader));
    }
}
function readSyntax(reader) {
    {
        let startPos = readerPos(reader), form = read(reader), endPos = readerPos(reader);
        if (isNotNil(form))
            metaSet(form, {});
        else {
        }
        return form;
    }
}
function readMany(reader) {
    {
        let results = list();
        while (true) {
            skipWhitespace(reader);
            if (hasMore(reader)) {
                results = append(results, readSyntax(reader));
                continue;
            } else
                return results;
        }
    }
}
function stringToExpr(str) {
    return readSyntax(makeStringReader(str));
}
function stringToExprs(str) {
    return readMany(makeStringReader(str));
}
let jsKeywords = set('var', 'let', 'const');
let emitSpecials = hashMap();
function isFieldAccess(form) {
    return isSymbol(form) && isStringPrefix(symbolToString(form), '.-');
}
function isMethodCall(form) {
    return isSymbol(form) && isStringPrefix(symbolToString(form), '.');
}
function isSpecial(form) {
    return isSymbol(form) && containsKey(emitSpecials, form);
}
function isJsKeyword(ident) {
    return isSetContains(jsKeywords, ident);
}
function isExpression(node) {
    {
        let type = node.type;
        return type === 'Literal' || type === 'Identifier' || isStringSuffix(type, 'Expression') || isStringSuffix(type, 'Element');
    }
}
function compilerError(form, msg) {
    if (meta(form) && meta(form).loc) {
        let loc = meta(form).loc, lineIndex = loc.start.line - 1, afterLineIndex = lineIndex + 1, beforeLineIndex = lineIndex - 1, lines = loc.source.split('\n'), line = lines[lineIndex], afterLine = lines[afterLineIndex], beforeLine = lines[beforeLineIndex], col = loc.start.column, caretLine = concat(stringRepeat(' ', col), '^');
        return error(msg + '\n\n' + beforeLine + '\n' + line + '\n' + caretLine + '\n' + afterLine);
    } else
        return error(msg);
}
function makeEnv() {
    return {
        'variables': hashMap(),
        'isLoop': false
    };
}
function childEnv(env) {
    return {
        'variables': hashMapCopy(env.variables),
        'loopVariables': (() => {
            if (isNotNil(env.loopVariables))
                return arrayCopy(env.loopVariables);
            else {
                return;
            }
        })(),
        'isLoop': false
    };
}
function recurEnv(env) {
    return {
        'variables': hashMapCopy(env.variables),
        'loopVariables': [],
        'isLoop': true
    };
}
function replaceSpecialChars(ident) {
    return ident.replace('!', '').replace('->', '-to-').replace(regex('^((contains|has).*)\\?$'), '$1').replace(regex('^(.*)\\?$'), 'is-$1');
}
function kebabcaseToCamelcase(ident) {
    return replaceSpecialChars(ident).replace(regex('[-_]([a-zA-Z])', 'g'), (match, p1) => {
        return p1.toUpperCase();
    });
}
function sanitizeJsKeywords(ident) {
    if (isJsKeyword(ident))
        return concat(ident, '$');
    else
        return ident;
}
function symbolToIdent(symbol) {
    if (symbol === stringToSymbol('Symbol'))
        return 'LispSymbol';
    else
        return sanitizeJsKeywords(kebabcaseToCamelcase(symbolToString(symbol)));
}
function defineVariable(env, symbol) {
    {
        let variables = env.variables;
        if (not(containsKey(variables, symbol)))
            hashMapSet(variables, symbol, symbolToIdent(symbol));
        else {
        }
        if (env.isLoop)
            env.loopVariables.push(symbol);
        else {
        }
        return resolveVar(env, symbol);
    }
}
function defineFunction(env, symbol) {
    {
        let variables = env.variables;
        if (not(containsKey(variables, symbol)))
            hashMapSet(variables, symbol, symbolToIdent(symbol));
        else {
        }
        return resolveVar(env, symbol);
    }
}
function resolveVar(env, symbol) {
    {
        let variables = env.variables, string = symbolToString(symbol), loc = (() => {
                if (meta(symbol))
                    return meta(symbol).loc;
                else {
                    return;
                }
            })();
        if (isStringPrefix(string, 'js/'))
            return {
                'type': 'Identifier',
                'name': string.substring(3),
                'originalName': string,
                'loc': loc
            };
        else if (not(containsKey(variables, symbol)))
            return compilerError(symbol, 'Symbol not found: ' + string);
        else
            return {
                'type': 'Identifier',
                'name': hashMapGet(variables, symbol),
                'originalName': symbolToString(symbol),
                'loc': loc
            };
    }
}
function statementToIife(node) {
    return {
        'type': 'CallExpression',
        'callee': {
            'type': 'ArrowFunctionExpression',
            'id': null,
            'params': [],
            'body': {
                'type': 'BlockStatement',
                'body': [statementToReturn(node)],
                'loc': node.loc
            }
        },
        'arguments': []
    };
}
function statementToExpression(node) {
    return statementToIife(node);
}
function statementsToReturn(nodes) {
    if (isEmpty(nodes))
        return [{
                'type': 'ReturnStatement',
                'argument': null
            }];
    else
        return mapLast(nodes, null, statementToReturn);
}
function statementToReturn(node) {
    {
        let type = node.type;
        if (type === 'ReturnStatement')
            return node;
        else if (type === 'ForOfStatement')
            return node;
        else if (type === 'ContinueStatement')
            return node;
        else if (type === 'ThrowStatement')
            return node;
        else if (type === 'ExpressionStatement')
            return {
                'type': 'ReturnStatement',
                'argument': node.expression,
                'loc': node.loc
            };
        else if (type === 'BlockStatement')
            return {
                'type': 'BlockStatement',
                'body': statementsToReturn(node.body),
                'loc': node.loc
            };
        else if (type === 'WhileStatement')
            return {
                'type': 'WhileStatement',
                'test': node.test,
                'body': statementToReturn(node.body),
                'loc': node.loc
            };
        else if (type === 'IfStatement')
            return {
                'type': 'IfStatement',
                'test': node.test,
                'consequent': statementToReturn(node.consequent),
                'alternate': (() => {
                    if (node.alternate)
                        return statementToReturn(node.alternate);
                    else
                        return null;
                })(),
                'loc': node.loc
            };
        else
            return error(concat('Unsupported return statement: ', type));
    }
}
function emitReturnLast(env, forms) {
    return mapLast(forms, form => {
        return emitStatement(env, form);
    }, form => {
        return emitReturnStatement(env, form);
    });
}
function emitReturnBlock(env, forms) {
    return {
        'type': 'BlockStatement',
        'body': emitReturnLast(env, forms)
    };
}
function emitReturnStatement(env, form) {
    {
        let node = emit(env, form);
        if (isExpression(node))
            return {
                'type': 'ReturnStatement',
                'argument': node,
                'loc': node.loc
            };
        else
            return statementToReturn(node);
    }
}
function emitStatements(env, forms) {
    return map(forms, form => {
        return emitStatement(env, form);
    });
}
function emitStatement(env, form) {
    {
        let node = emit(env, form);
        if (isExpression(node))
            return {
                'type': 'ExpressionStatement',
                'expression': node,
                'loc': node.loc
            };
        else
            return node;
    }
}
function emitExpressions(env, forms) {
    return map(forms, form => {
        return emitExpression(env, form);
    });
}
function emitExpression(env, form) {
    {
        let node = emit(env, form);
        if (isExpression(node))
            return node;
        else
            return statementToExpression(node);
    }
}
function emitPatterns(env, forms) {
    return map(forms, form => {
        return emitPattern(env, form);
    });
}
function emitPattern(env, form) {
    if (isSymbol(form))
        return defineVariable(env, form);
    else if (isTaggedList(form, stringToSymbol('spread')))
        return {
            'type': 'RestElement',
            'argument': defineVariable(env, second(form)),
            'loc': meta(form).loc
        };
    else if (isList(form))
        return {
            'type': 'ArrayPattern',
            'elements': emitPatterns(env, form)
        };
    else
        return compilerError(form, 'Unrecognized pattern');
}
function emitBlock(env, forms) {
    if (isSingle(forms))
        return emitStatement(env, first(forms));
    else
        return {
            'type': 'BlockStatement',
            'body': emitStatements(env, forms)
        };
}
function emitModule(forms) {
    {
        let env = makeEnv();
        for (form of forms)
            if (isTaggedList(form, stringToSymbol('defn')))
                defineVariable(env, second(form));
            else {
            }
        return {
            'type': 'Program',
            'body': emitStatements(env, forms)
        };
    }
}
function emit(env, form) {
    if (isSymbol(form))
        return emitVar(env, form);
    else if (isList(form))
        return emitList(env, form);
    else
        return emitLiteral(env, form);
}
function emitLiteral(env, form) {
    if (form === undefined)
        return error('Undefined!');
    else if (isKeyword(form))
        return emit(env, list(stringToSymbol('string->keyword'), keywordToString(form)));
    else
        return {
            'type': 'Literal',
            'value': unbox(form),
            'loc': (() => {
                if (isNotNil(form) && meta(form))
                    return meta(form).loc;
                else {
                    return;
                }
            })()
        };
}
function emitVar(env, symbol) {
    return resolveVar(env, symbol);
}
function emitList(env, form) {
    {
        let loc = (() => {
                if (meta(form))
                    return meta(form).loc;
                else {
                    return;
                }
            })(), callee = first(form), args = skip1(form);
        if (isFieldAccess(callee))
            return emitField(env, loc, callee, args);
        else if (isMethodCall(callee))
            return emitMethodcall(env, loc, callee, args);
        else if (isSpecial(callee))
            return hashMapGet(emitSpecials, callee)(env, loc, args);
        else
            return emitFuncall(env, loc, callee, args);
    }
}
function emitField(env, loc, callee, args) {
    {
        let fieldName = symbolToString(callee).substring(2), obj = first(args);
        return {
            'type': 'MemberExpression',
            'object': emitExpression(env, obj),
            'property': {
                'type': 'Identifier',
                'name': fieldName,
                'loc': meta(callee).loc
            },
            'computed': false,
            'loc': loc
        };
    }
}
function emitMethodcall(env, loc, callee, args) {
    {
        let methodName = symbolToString(callee).substring(1), obj = first(args), methodArgs = skip1(args);
        return {
            'type': 'CallExpression',
            'callee': {
                'type': 'MemberExpression',
                'object': emitExpression(env, obj),
                'property': {
                    'type': 'Identifier',
                    'name': methodName,
                    'loc': meta(callee).loc
                },
                'computed': false
            },
            'arguments': emitExpressions(env, methodArgs),
            'loc': loc
        };
    }
}
function emitFuncall(env, loc, callee, args) {
    return {
        'type': 'CallExpression',
        'callee': emitExpression(env, callee),
        'arguments': emitExpressions(env, args),
        'loc': loc
    };
}
function emitDefn(env, loc, args) {
    {
        let ident = defineFunction(env, first(args)), params = second(args), rest = skip2(args), docs = (() => {
                if (isString(first(rest)) && isNotEmpty(skip1(rest)))
                    return first(rest);
                else {
                    return;
                }
            })(), body = (() => {
                if (docs)
                    return skip1(rest);
                else
                    return rest;
            })(), funcEnv = childEnv(env);
        return {
            'type': 'FunctionDeclaration',
            'id': ident,
            'params': emitPatterns(funcEnv, params),
            'body': emitReturnBlock(funcEnv, body),
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('defn'), emitDefn);
function emitDefgen(env, loc, args) {
    {
        let ident = defineFunction(env, first(args)), params = second(args), rest = skip2(args), docs = (() => {
                if (isString(first(rest)) && isNotEmpty(skip1(rest)))
                    return first(rest);
                else {
                    return;
                }
            })(), body = (() => {
                if (docs)
                    return skip1(rest);
                else
                    return rest;
            })(), funcEnv = childEnv(env);
        return {
            'type': 'FunctionDeclaration',
            'id': ident,
            'params': emitPatterns(funcEnv, params),
            'body': emitReturnBlock(funcEnv, body),
            'generator': true,
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('defgen'), emitDefgen);
function emitReturn(env, loc, args) {
    return {
        'type': 'ReturnStatement',
        'argument': (() => {
            if (isNotEmpty(args))
                return emitExpression(env, first(args));
            else {
                return;
            }
        })(),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('return'), emitReturn);
function emitSet(env, loc, args) {
    {
        let setter = first(args), value = second(args);
        if (isSymbol(setter))
            return emitSetVar(env, loc, setter, value);
        else if (isList(setter))
            return emitSetter(env, loc, setter, value);
        else
            return error(concat('Invalid setter: ', repr(setter)));
    }
}
function emitSetter(env, loc, setter, value) {
    {
        let callee = first(setter), args = skip1(setter);
        if (isFieldAccess(callee))
            return emitSetField(env, loc, callee, args, value);
        else if (callee === stringToSymbol('js/index'))
            return emitSetIndex(env, loc, args, value);
        else
            return error(concat('Invalid setter: ', repr(setter)));
    }
}
function emitSetVar(env, loc, symbol, value) {
    return {
        'type': 'AssignmentExpression',
        'operator': '=',
        'left': resolveVar(env, symbol),
        'right': emitExpression(env, value),
        'loc': loc
    };
}
function emitSetField(env, loc, symbol, args, value) {
    {
        let fieldName = symbolToString(symbol).substring(2), obj = first(args);
        return {
            'type': 'AssignmentExpression',
            'operator': '=',
            'left': {
                'type': 'MemberExpression',
                'object': emitExpression(env, obj),
                'property': {
                    'type': 'Identifier',
                    'name': fieldName,
                    'loc': meta(symbol).loc
                },
                'computed': false
            },
            'right': emitExpression(env, value),
            'loc': loc
        };
    }
}
function emitSetIndex(env, loc, args, value) {
    {
        let obj = first(args), index = second(args);
        return {
            'type': 'AssignmentExpression',
            'operator': '=',
            'left': {
                'type': 'MemberExpression',
                'object': emitExpression(env, obj),
                'property': emitExpression(env, index),
                'computed': true
            },
            'right': emitExpression(env, value),
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('set!'), emitSet);
function emitBinOp(op) {
    return (env, loc, args) => {
        if (isEmpty(args))
            error('Empty operator expression');
        else {
        }
        return emitExpressions(env, args).reduce((acc, arg) => {
            return {
                'type': 'BinaryExpression',
                'operator': op,
                'left': acc,
                'right': arg,
                'loc': loc
            };
        });
    };
}
hashMapSet(emitSpecials, stringToSymbol('and'), emitBinOp('&&'));
hashMapSet(emitSpecials, stringToSymbol('or'), emitBinOp('||'));
hashMapSet(emitSpecials, stringToSymbol('js/and'), emitBinOp('&&'));
hashMapSet(emitSpecials, stringToSymbol('js/or'), emitBinOp('||'));
hashMapSet(emitSpecials, stringToSymbol('js/==='), emitBinOp('==='));
hashMapSet(emitSpecials, stringToSymbol('js/!=='), emitBinOp('!=='));
hashMapSet(emitSpecials, stringToSymbol('js/=='), emitBinOp('=='));
hashMapSet(emitSpecials, stringToSymbol('js/!='), emitBinOp('!='));
hashMapSet(emitSpecials, stringToSymbol('='), emitBinOp('==='));
hashMapSet(emitSpecials, stringToSymbol('!='), emitBinOp('!=='));
hashMapSet(emitSpecials, stringToSymbol('>='), emitBinOp('>='));
hashMapSet(emitSpecials, stringToSymbol('<='), emitBinOp('<='));
hashMapSet(emitSpecials, stringToSymbol('>'), emitBinOp('>'));
hashMapSet(emitSpecials, stringToSymbol('<'), emitBinOp('<'));
hashMapSet(emitSpecials, stringToSymbol('+'), emitBinOp('+'));
hashMapSet(emitSpecials, stringToSymbol('-'), emitBinOp('-'));
hashMapSet(emitSpecials, stringToSymbol('mod'), emitBinOp('%'));
hashMapSet(emitSpecials, stringToSymbol('js/instanceof'), emitBinOp('instanceof'));
function emitSpread(env, loc, args) {
    return {
        'type': 'SpreadElement',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('spread'), emitSpread);
function emitArray(env, loc, args) {
    return {
        'type': 'ArrayExpression',
        'elements': emitExpressions(env, args),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('js/array'), emitArray);
function emitFn(env, loc, args) {
    {
        let params = first(args), body = skip1(args), funcEnv = childEnv(env);
        return {
            'type': 'ArrowFunctionExpression',
            'id': null,
            'params': emitPatterns(funcEnv, params),
            'body': emitReturnBlock(funcEnv, body),
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('fn'), emitFn);
function emitIf(env, loc, args) {
    {
        let test = first(args), ifTrue = second(args), ifFalse = skip2(args);
        return {
            'type': 'IfStatement',
            'test': emitExpression(env, test),
            'consequent': emitStatement(env, ifTrue),
            'alternate': (() => {
                if (isNotNil(ifFalse))
                    return emitBlock(env, ifFalse);
                else {
                    return;
                }
            })(),
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('if'), emitIf);
function emitFor(env, loc, args) {
    {
        let var$ = first(first(args)), value = second(first(args)), body = skip1(args), forEnv = childEnv(env);
        return {
            'type': 'ForOfStatement',
            'left': emitPattern(forEnv, var$),
            'right': emitExpression(forEnv, value),
            'body': emitBlock(forEnv, body),
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('for'), emitFor);
function emitDef(env, loc, args) {
    return {
        'type': 'VariableDeclaration',
        'kind': 'let',
        'declarations': [{
                'type': 'VariableDeclarator',
                'id': defineVariable(env, first(args)),
                'init': emitExpression(env, second(args)),
                'loc': loc
            }],
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('def'), emitDef);
function emitVars(env, vars) {
    return {
        'type': 'VariableDeclaration',
        'kind': 'let',
        'declarations': map(Array.from(grouped(vars, 2)), pair => {
            return {
                'type': 'VariableDeclarator',
                'id': defineVariable(env, first(pair)),
                'init': emitExpression(env, second(pair))
            };
        }),
        'loc': meta(vars).loc
    };
}
function emitLet(env, loc, args) {
    {
        let vars = first(args), body = skip1(args), letEnv = childEnv(env);
        return {
            'type': 'BlockStatement',
            'body': [
                emitVars(letEnv, vars),
                ...emitStatements(letEnv, body)
            ],
            'loc': loc
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('let'), emitLet);
function emitCond(env, loc, args) {
    function emitBranch(args) {
        {
            let expr = first(args), rest = skip1(args), test = first(expr), body = skip1(expr);
            if (test === stringToSymbol('else'))
                return emitBlock(env, body);
            else
                return {
                    'type': 'IfStatement',
                    'test': emitExpression(env, test),
                    'consequent': emitBlock(env, body),
                    'alternate': (() => {
                        if (isNotEmpty(rest))
                            return emitBranch(rest);
                        else {
                            return;
                        }
                    })()
                };
        }
    }
    return emitBranch(args);
}
hashMapSet(emitSpecials, stringToSymbol('cond'), emitCond);
function emitLoop(env, loc, args) {
    {
        let vars = first(args), body = skip1(args), loopEnv = recurEnv(env);
        if (isEmpty(vars))
            return {
                'type': 'WhileStatement',
                'test': emitLiteral(loopEnv, true),
                'body': emitReturnBlock(loopEnv, body)
            };
        else
            return {
                'type': 'BlockStatement',
                'body': [
                    emitVars(loopEnv, vars),
                    {
                        'type': 'WhileStatement',
                        'test': emitLiteral(loopEnv, true),
                        'body': emitReturnBlock(loopEnv, body)
                    }
                ]
            };
    }
}
hashMapSet(emitSpecials, stringToSymbol('loop'), emitLoop);
function emitDo(env, loc, args) {
    return {
        'type': 'BlockStatement',
        'body': emitStatements(env, args),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('do'), emitDo);
function emitYield(env, loc, args) {
    return {
        'type': 'YieldExpression',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('yield'), emitYield);
function emitRecur(env, loc, args) {
    if (env.loopVariables.length !== args.length)
        error('Recur with not enough args' + env.loopVariables.length + args.length);
    else {
    }
    if (isEmpty(args))
        return {
            'type': 'ContinueStatement',
            'loc': loc
        };
    else
        return {
            'type': 'BlockStatement',
            'body': [
                ...map(zip(env.loopVariables, args), pair => {
                    return {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': emitPattern(env, first(pair)),
                            'right': emitExpression(env, second(pair))
                        }
                    };
                }),
                { 'type': 'ContinueStatement' }
            ],
            'loc': loc
        };
}
hashMapSet(emitSpecials, stringToSymbol('recur'), emitRecur);
function emitDict(env, ctx, args) {
    return {
        'type': 'ObjectExpression',
        'properties': map(Array.from(grouped(args, 2)), pair => {
            return {
                'type': 'Property',
                'key': (() => {
                    if (isKeyword(first(pair)))
                        return emitLiteral(env, kebabcaseToCamelcase(keywordToString(first(pair))));
                    else
                        return emitLiteral(env, first(pair));
                })(),
                'value': emitExpression(env, second(pair))
            };
        })
    };
}
hashMapSet(emitSpecials, stringToSymbol('dict'), emitDict);
function emitQuote(env, loc, args) {
    return emit(env, knightQuote(first(args)));
}
function knightQuote(form) {
    if (isSymbol(form))
        return list(stringToSymbol('string->symbol'), symbolToString(form));
    else if (isList(form))
        return append(list(stringToSymbol('js/array')), map(knightQuote, form));
    else
        return form;
}
hashMapSet(emitSpecials, stringToSymbol('quote'), emitQuote);
function emitReturn(env, loc, args) {
    return {
        'type': 'ReturnStatement',
        'argument': (() => {
            if (isNotEmpty(args))
                return emitExpression(env, first(args));
            else
                return null;
        })(),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('js/return'), emitReturn);
function emitThrow(env, loc, args) {
    return {
        'type': 'ThrowStatement',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('js/throw'), emitThrow);
function emitNew(env, loc, args) {
    return {
        'type': 'NewExpression',
        'callee': emitExpression(env, first(args)),
        'arguments': emitExpressions(env, skip1(args)),
        'loc': loc
    };
}
hashMapSet(emitSpecials, stringToSymbol('js/new'), emitNew);
function emitIndex(env, ctx, args) {
    {
        let obj = first(args), index = second(args);
        return {
            'type': 'MemberExpression',
            'object': emitExpression(env, obj),
            'property': emitExpression(env, index),
            'computed': true
        };
    }
}
hashMapSet(emitSpecials, stringToSymbol('js/index'), emitIndex);
let fs = require('fs');
let escodegen = require('escodegen');
{
    let text = fs.readFileSync(0, 'utf-8'), forms = stringToExprs(text), ast = emitModule(forms), output = escodegen.generate(ast);
    println(output);
}
