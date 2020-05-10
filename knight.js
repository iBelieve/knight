function hashMap() {
    return new Map();
}
function hashMapSet(map, key, value) {
    return map.set(key, value);
}
function readQuote(reader, firstChar, pos) {
    return list(stringToSymbol('quote'), readSyntax(reader));
}
function list(...items) {
    return [...items];
}
function stringToSymbol(string) {
    if (not(containsKey(internedSymbols, string)))
        hashMapSet(internedSymbols, string, new LispSymbol(string));
    else {
    }
    return hashMapGet(internedSymbols, string);
}
function not(value) {
    return value === false || value == null;
}
function containsKey(map, key) {
    return map.has(key);
}
function LispSymbol(name) {
    this.name = name;
    return;
}
function hashMapGet(map, key) {
    return map.get(key);
}
function readSyntax(reader) {
    {
        let startPos = readerPos(reader), form = read(reader, startPos), endPos = readerPos(reader);
        if (isNotNil(form))
            metaSet(form, {
                'loc': {
                    'source': reader.input,
                    'start': startPos,
                    'end': endPos
                }
            });
        else {
        }
        return form;
    }
}
function readerPos(reader) {
    return {
        'line': reader.line,
        'column': reader.column
    };
}
function read(reader, pos) {
    skipWhitespace(reader);
    {
        let c = peekChar(reader);
        if (isCharDigit(c))
            return readNumber(reader);
        else if (isCharMacro(c)) {
            let macro = hashMapGet(readerMacros, c);
            readChar(reader);
            return macro(reader, c, pos);
        } else if ((c === '+' || c === '-') && isCharDigit(peekChar(reader, 1)))
            return readNumber(reader);
        else
            return parseToken(readToken(reader));
    }
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
function takeWhile(reader, predicate) {
    return takeUntil(reader, char => {
        return not(predicate(char));
    });
}
function takeUntil(reader, predicate) {
    {
        let startIndex = reader.index, inputLength = reader.input.length;
        {
            let index = reader.index, line = reader.line, column = reader.column;
            while (true) {
                {
                    let char = reader.input[index];
                    if (index >= inputLength || predicate(char)) {
                        reader.index = index;
                        reader.line = line;
                        reader.column = column;
                        return reader.input.substring(startIndex, index);
                    } else if (char === '\n') {
                        index = index + 1;
                        line = line + 1;
                        column = 0;
                        continue;
                    } else {
                        index = index + 1;
                        line = line;
                        column = column + 1;
                        continue;
                    }
                }
            }
        }
    }
}
function isCharWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\n' || char === ',';
}
function peekChar(reader, offset) {
    return reader.input[(() => {
        if (isNotNil(offset))
            return reader.index + offset;
        else
            return reader.index;
    })()];
}
function isNotNil(value) {
    return value != null;
}
function isCharDigit(char) {
    return char >= '0' && char <= '9';
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
function readToken(reader) {
    return concat(readChar(reader), takeUntil(reader, c => {
        return isCharWhitespace(c) || isCharMacro(c);
    }));
}
function concat(a, b) {
    return a + b;
}
function readChar(reader) {
    {
        let char = reader.input[reader.index];
        reader.index = reader.index + 1;
        if (char === '\n') {
            reader.line = reader.line + 1;
            reader.column = 0;
        } else
            reader.column = reader.column + 1;
        return char;
    }
}
function isCharMacro(char) {
    return containsKey(readerMacros, char);
}
function isStringContains(string, substring) {
    return string.includes(substring);
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
function isStringPrefix(string, prefix) {
    return string.startsWith(prefix);
}
function isStringSuffix(string, prefix) {
    return string.endsWith(prefix);
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
function Keyword(name) {
    this.name = name;
    return;
}
function metaSet(value, meta) {
    value[symbolMeta] = meta;
    return;
}
function readSyntaxQuote(reader, firstChar, pos) {
    return expandSyntaxQuote(readSyntax(reader));
}
function expandSyntaxQuote(form) {
    if (isSelfEvaluating(form))
        return form;
    else if (isSymbol(form))
        return list(stringToSymbol('quote'), form);
    else if (isTaggedList(form, stringToSymbol('unquote')))
        return second(form);
    else if (isList(form))
        return list(stringToSymbol('list'), ...map(form, expandSyntaxQuote));
    else
        return list(stringToSymbol('quote'), form);
}
function isSelfEvaluating(form) {
    return isBool(form) || isNumber(form) || isString(form) || isKeyword(form);
}
function isBool(value) {
    return typeof(value) === 'boolean' || value instanceof Boolean;
}
function isNumber(value) {
    return typeof(value) === 'number' || value instanceof Number;
}
function isString(value) {
    return typeof(value) === 'string' || value instanceof String;
}
function isKeyword(value) {
    return value instanceof Keyword;
}
function isSymbol(value) {
    return value instanceof LispSymbol;
}
function isTaggedList(value, tag) {
    return isList(value) && first(value) === tag;
}
function isList(value) {
    return Array.isArray(value);
}
function first(list) {
    return list[0];
}
function second(list) {
    return list[1];
}
function map(array, func) {
    return array.map(func);
}
function readSpread(reader, firstChar, pos) {
    return list(stringToSymbol('spread'), readSyntax(reader));
}
function readUnquote(reader, firstChar, pos) {
    return list(stringToSymbol('unquote'), readSyntax(reader));
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
function error(msg) {
    throw new Error(msg);
}
function readString(reader, firstChar, pos) {
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
function isNil(value) {
    return value == null;
}
function readUnicodeChar(reader) {
    {
        let a = readChar(reader), b = readChar(reader), c = readChar(reader), d = readChar(reader);
        return String.fromCharCode(parseInt(a + b + c + d));
    }
}
function readList(reader, firstChar, pos) {
    return readUntil(reader, ')', pos);
}
function readUntil(reader, endChar, startPos) {
    {
        let hasIndentError = false, startIndex = reader.index - 1, startLine = startPos.line, startIndent = startPos.column;
        {
            let results = list();
            while (true) {
                if (not(hasIndentError)) {
                    let lastPos = readerPos(reader);
                    skipWhitespace(reader);
                    {
                        let pos = readerPos(reader), line = pos.line, indent = pos.column;
                        if (line > startLine && indent <= startIndent) {
                            hasIndentError = true;
                            readerIndentWarning(reader, startIndex, endChar, lastPos);
                        } else {
                        }
                    }
                } else {
                }
                {
                    let char = peekChar(reader);
                    if (isNil(char))
                        return readerUnterminatedError(reader, startIndex, startPos, endChar);
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
}
function readerIndentWarning(reader, startIndex, endChar, pos) {
    return reader.indentWarnings.push({
        'startIndex': startIndex,
        'endChar': endChar,
        'pos': pos
    });
}
function readerUnterminatedError(reader, startIndex, startPos, endChar) {
    {
        let warning = findFirst(reader.indentWarnings, w => {
            return w.startIndex >= startIndex;
        });
        console.error(warning);
        return error('Unexpected EOF, expected: \'' + endChar + '\'\n\n' + 'Started here:\n' + markedLine(reader.input, startPos) + '\n\n' + 'Based on indent:\n' + markedLine(reader.input, warning.pos));
    }
}
function findFirst(seq, predicate) {
    return seq.find(predicate);
}
function markedLine(input, pos) {
    {
        let lineIndex = pos.line - 1, beforeLineIndex = lineIndex - 1, afterLineIndex = lineIndex + 1, lines = input.split('\n'), line = lines[lineIndex], beforeLine = lines[beforeLineIndex] || '', afterLine = lines[afterLineIndex] || '', col = pos.column, caretLine = concat(stringRepeat(' ', col), '^'), lineNum = string(lineIndex + 1), beforeLineNum = string(beforeLineIndex + 1), afterLineNum = string(afterLineIndex + 1), maxLineNumWidth = max(lineNum.length, beforeLineNum.length, afterLineNum.length);
        return stringPadStart(beforeLineNum, maxLineNumWidth) + ' ' + beforeLine + '\n' + stringPadStart(lineNum, maxLineNumWidth) + ' ' + line + '\n' + stringRepeat(' ', maxLineNumWidth) + ' ' + caretLine + '\n' + stringPadStart(afterLineNum, maxLineNumWidth) + ' ' + afterLine;
    }
}
function stringRepeat(str, count) {
    return str.repeat(count);
}
function string(value) {
    if (isNil(value))
        return 'nil';
    else if (isString(value))
        return value;
    else if (isNumber(value))
        return value.toString();
    else if (isBool(value))
        return value.toString();
    else
        return repr(value);
}
function repr(value) {
    if (isNil(value))
        return 'nil';
    else if (isSymbol(value))
        return symbolToString(value);
    else if (isList(value))
        return '(' + stringJoin(map(value, repr), ' ') + ')';
    else
        return JSON.stringify(value);
}
function symbolToString(symbol) {
    return symbol.name;
}
function stringJoin(string, sep) {
    return string.join(sep);
}
function max(...values) {
    return Math.max(...values);
}
function stringPadStart(string, width, filler) {
    return string.padStart(width, filler);
}
function append(list, ...items) {
    return [
        ...list,
        ...items
    ];
}
function readUnmatchedDelimiter(reader, firstChar) {
    return error(concat('Unmatched delimiter: ', firstChar));
}
function readArray(reader, firstChar, pos) {
    return readUntil(reader, ']', pos);
}
function readStruct(reader, firstChar, pos) {
    return list(stringToSymbol('dict'), ...readUntil(reader, '}', pos));
}
function set(...values) {
    return new Set(values);
}
function emitDefn(env, loc, args) {
    {
        let name = first(args), ident = symbolToIdent(name), params = second(args), rest = skip2(args), docs = (() => {
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
        return defineFunction(env, name, {
            'name': name,
            'ident': ident,
            'params': params,
            'docs': docs,
            'body': body,
            'loc': loc,
            'generator': false
        });
    }
}
function symbolToIdent(symbol) {
    if (symbol === stringToSymbol('Symbol'))
        return 'LispSymbol';
    else
        return sanitizeJsKeywords(kebabcaseToCamelcase(symbolToString(symbol)));
}
function sanitizeJsKeywords(ident) {
    if (isJsKeyword(ident))
        return concat(ident, '$');
    else
        return ident;
}
function isJsKeyword(ident) {
    return isSetContains(jsKeywords, ident);
}
function isSetContains(set, value) {
    return set.has(value);
}
function kebabcaseToCamelcase(ident) {
    return replaceSpecialChars(ident).replace(regex('[-_]([a-zA-Z])', 'g'), (match, p1) => {
        return p1.toUpperCase();
    });
}
function replaceSpecialChars(ident) {
    return ident.replace('!', '').replace('->', '-to-').replace(regex('^((contains|has).*)\\?$'), '$1').replace(regex('^(.*)\\?$'), 'is-$1');
}
function regex(str, flags) {
    return new RegExp(str, flags);
}
function skip2(list) {
    return list.slice(2);
}
function isNotEmpty(value) {
    return isNotNil(value) && value.length > 0;
}
function skip1(list) {
    return list.slice(1);
}
function childEnv(env) {
    return {
        'variables': hashMapCopy(env.variables),
        'loopVariables': env.loopVariables,
        'functions': env.functions,
        'functionNodes': env.functionNodes,
        'isLoop': false
    };
}
function hashMapCopy(map) {
    return new Map(map);
}
function defineFunction(env, name, func) {
    {
        let functions = env.functions;
        if (containsKey(functions, name))
            error('Function already defined: ' + symbolToString(name));
        else
            hashMapSet(functions, name, func);
        return null;
    }
}
function emitDefgen(env, loc, args) {
    {
        let name = first(args), ident = symbolToIdent(name), params = second(args), rest = skip2(args), docs = (() => {
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
        return defineFunction(env, name, {
            'name': name,
            'ident': ident,
            'params': params,
            'docs': docs,
            'body': body,
            'loc': loc,
            'generator': true
        });
    }
}
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
function emitSetVar(env, loc, symbol, value) {
    return {
        'type': 'AssignmentExpression',
        'operator': '=',
        'left': resolveVar(env, symbol),
        'right': emitExpression(env, value),
        'loc': loc
    };
}
function resolveVar(env, symbol) {
    {
        let variables = env.variables, functions = env.functions, functionNodes = env.functionNodes, string = symbolToString(symbol), loc = (() => {
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
        else if (containsKey(variables, symbol))
            return {
                'type': 'Identifier',
                'name': hashMapGet(variables, symbol),
                'originalName': string,
                'loc': loc
            };
        else if (containsKey(functions, symbol)) {
            if (not(containsKey(functionNodes, symbol)))
                compileFunction(env, hashMapGet(functions, symbol));
            else {
            }
            return {
                'type': 'Identifier',
                'name': hashMapGet(functions, symbol).ident,
                'originalName': string,
                'loc': loc
            };
        } else
            return compilerError(symbol, 'Variable or function not found: ' + string + ' - ' + map(Array.from(variables.keys()), symbolToString) + ' - ' + map(Array.from(functions.keys()), symbolToString));
    }
}
function meta(value) {
    return value[symbolMeta];
}
function compileFunction(env, func) {
    {
        let funcEnv = childEnv(env);
        hashMapSet(env.functionNodes, func.name, stringToSymbol('placeholder'));
        return hashMapSet(env.functionNodes, func.name, {
            'type': 'FunctionDeclaration',
            'id': {
                'type': 'Identifier',
                'name': func.ident,
                'originalName': symbolToString(func.name),
                'loc': meta(func.name).loc
            },
            'params': emitPatterns(funcEnv, func.params),
            'body': emitReturnBlock(funcEnv, func.body),
            'generator': func.generator,
            'loc': func.loc
        });
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
function compilerError(form, msg) {
    if (meta(form) && meta(form).loc) {
        let loc = meta(form).loc, source = loc.source, pos = loc.start;
        return error(msg + '\n\n' + markedLine(source, pos));
    } else
        return error(msg);
}
function emitReturnBlock(env, forms) {
    return {
        'type': 'BlockStatement',
        'body': emitReturnLast(env, forms)
    };
}
function emitReturnLast(env, forms) {
    return filterNotNil(mapLast(forms, form => {
        return emitStatement(env, form);
    }, form => {
        return emitReturnStatement(env, form);
    }));
}
function filterNotNil(seq) {
    return filter(seq, value => {
        return isNotNil(value);
    });
}
function filter(seq, predicate) {
    return seq.filter(predicate);
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
function emitStatement(env, form) {
    {
        let node = emit(env, form);
        if (isNil(node))
            return node;
        else if (isExpression(node))
            return {
                'type': 'ExpressionStatement',
                'expression': node,
                'loc': node.loc
            };
        else
            return node;
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
function isFieldAccess(form) {
    return isSymbol(form) && isStringPrefix(symbolToString(form), '.-');
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
function emitExpression(env, form) {
    {
        let node = emit(env, form);
        if (isNil(node))
            return node;
        else if (isExpression(node))
            return node;
        else
            return statementToExpression(node);
    }
}
function isExpression(node) {
    {
        let type = node.type;
        return type === 'Literal' || type === 'Identifier' || isStringSuffix(type, 'Expression') || isStringSuffix(type, 'Element');
    }
}
function statementToExpression(node) {
    return statementToIife(node);
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
function statementsToReturn(nodes) {
    if (isEmpty(nodes))
        return [{
                'type': 'ReturnStatement',
                'argument': null
            }];
    else
        return mapLast(nodes, null, statementToReturn);
}
function isEmpty(value) {
    return value.length === 0;
}
function isMethodCall(form) {
    return isSymbol(form) && isStringPrefix(symbolToString(form), '.');
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
function emitExpressions(env, forms) {
    return mapNotNil(forms, form => {
        return emitExpression(env, form);
    });
}
function mapNotNil(seq, func) {
    return filterNotNil(map(seq, func));
}
function isSpecial(form) {
    return isSymbol(form) && containsKey(emitSpecials, form);
}
function emitFuncall(env, loc, callee, args) {
    return {
        'type': 'CallExpression',
        'callee': emitExpression(env, callee),
        'arguments': emitExpressions(env, args),
        'loc': loc
    };
}
function emitLiteral(env, form) {
    if (form === undefined)
        return error('Undefined!');
    else if (isKeyword(form))
        return emit(env, list(stringToSymbol('string->keyword'), keywordToString(form)));
    else if (isNegative(form))
        return {
            'type': 'UnaryExpression',
            'operator': '-',
            'prefix': true,
            'argument': {
                'type': 'Literal',
                'value': neg(unbox(form))
            },
            'loc': (() => {
                if (isNotNil(form) && meta(form))
                    return meta(form).loc;
                else {
                    return;
                }
            })()
        };
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
function keywordToString(keyword) {
    return keyword.name;
}
function isNegative(value) {
    return isNumber(value) && value < 0;
}
function neg(value) {
    return -1 * value;
}
function unbox(value) {
    if (isNotNil(value))
        return value.valueOf();
    else
        return null;
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
function emitSetter(env, loc, setter, value) {
    {
        let callee = first(setter), args = skip1(setter);
        if (isFieldAccess(callee))
            return emitSetField(env, loc, callee, args, value);
        else if (callee === stringToSymbol('nth'))
            return emitSetIndex(env, loc, args, value);
        else
            return error(concat('Invalid setter: ', repr(setter)));
    }
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
function emitSpread(env, loc, args) {
    return {
        'type': 'SpreadElement',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
function emitArray(env, loc, args) {
    return {
        'type': 'ArrayExpression',
        'elements': emitExpressions(env, args),
        'loc': loc
    };
}
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
function emitBlock(env, forms) {
    if (isSingle(forms))
        return emitStatement(env, first(forms));
    else
        return {
            'type': 'BlockStatement',
            'body': emitStatements(env, forms)
        };
}
function isSingle(list) {
    return isList(list) && list.length === 1;
}
function emitStatements(env, forms) {
    return mapNotNil(forms, form => {
        return emitStatement(env, form);
    });
}
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
function emitCond(env, loc, args) {
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
                        return emitCond(env, loc, rest);
                    else {
                        return;
                    }
                })()
            };
    }
}
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
function recurEnv(env) {
    return {
        'variables': hashMapCopy(env.variables),
        'loopVariables': [],
        'functions': env.functions,
        'functionNodes': env.functionNodes,
        'isLoop': true
    };
}
function emitDo(env, loc, args) {
    return {
        'type': 'BlockStatement',
        'body': emitStatements(env, args),
        'loc': loc
    };
}
function emitYield(env, loc, args) {
    return {
        'type': 'YieldExpression',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
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
function zip(...arrays) {
    return map(first(arrays), (_, index) => {
        return map(arrays, array => {
            return array[index];
        });
    });
}
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
function emitQuote(env, loc, args) {
    return emit(env, knightQuote(first(args)));
}
function knightQuote(form) {
    if (isSymbol(form))
        return list(stringToSymbol('string->symbol'), symbolToString(form));
    else if (isList(form))
        return list(stringToSymbol('js/array'), ...map(form, knightQuote));
    else
        return form;
}
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
function emitThrow(env, loc, args) {
    return {
        'type': 'ThrowStatement',
        'argument': emitExpression(env, first(args)),
        'loc': loc
    };
}
function emitNew(env, loc, args) {
    return {
        'type': 'NewExpression',
        'callee': emitExpression(env, first(args)),
        'arguments': emitExpressions(env, skip1(args)),
        'loc': loc
    };
}
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
function stringToExprs(str) {
    return readMany(makeStringReader(str));
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
function hasMore(reader) {
    return reader.index < reader.input.length;
}
function makeStringReader(string) {
    return {
        'input': string,
        'index': 0,
        'line': 1,
        'column': 0,
        'indentWarnings': []
    };
}
function emitModule(forms) {
    {
        let env = makeEnv(), nodes = emitStatements(env, forms), functionNodes = env.functionNodes;
        return {
            'type': 'Program',
            'body': [
                ...functionNodes.values(),
                ...nodes
            ]
        };
    }
}
function makeEnv() {
    return {
        'functions': hashMap(),
        'functionNodes': hashMap(),
        'variables': hashMap(),
        'isLoop': false
    };
}
function println(...args) {
    return console.log(...map(args, string));
}
let internedSymbols = hashMap();
let internedKeywords = hashMap();
let symbolMeta = Symbol('meta');
let readerMacros = hashMap();
hashMapSet(readerMacros, '\'', readQuote);
hashMapSet(readerMacros, '`', readSyntaxQuote);
hashMapSet(readerMacros, '&', readSpread);
hashMapSet(readerMacros, '~', readUnquote);
hashMapSet(readerMacros, '\\', readCharacter);
hashMapSet(readerMacros, '"', readString);
hashMapSet(readerMacros, '(', readList);
hashMapSet(readerMacros, ')', readUnmatchedDelimiter);
hashMapSet(readerMacros, '[', readArray);
hashMapSet(readerMacros, ']', readUnmatchedDelimiter);
hashMapSet(readerMacros, '{', readStruct);
hashMapSet(readerMacros, '}', readUnmatchedDelimiter);
let jsKeywords = set('var', 'let', 'const');
let emitSpecials = hashMap();
hashMapSet(emitSpecials, stringToSymbol('defn'), emitDefn);
hashMapSet(emitSpecials, stringToSymbol('defgen'), emitDefgen);
hashMapSet(emitSpecials, stringToSymbol('set!'), emitSet);
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
hashMapSet(emitSpecials, stringToSymbol('*'), emitBinOp('*'));
hashMapSet(emitSpecials, stringToSymbol('/'), emitBinOp('/'));
hashMapSet(emitSpecials, stringToSymbol('mod'), emitBinOp('%'));
hashMapSet(emitSpecials, stringToSymbol('js/instanceof'), emitBinOp('instanceof'));
hashMapSet(emitSpecials, stringToSymbol('spread'), emitSpread);
hashMapSet(emitSpecials, stringToSymbol('js/array'), emitArray);
hashMapSet(emitSpecials, stringToSymbol('fn'), emitFn);
hashMapSet(emitSpecials, stringToSymbol('if'), emitIf);
hashMapSet(emitSpecials, stringToSymbol('for'), emitFor);
hashMapSet(emitSpecials, stringToSymbol('def'), emitDef);
hashMapSet(emitSpecials, stringToSymbol('let'), emitLet);
hashMapSet(emitSpecials, stringToSymbol('cond'), emitCond);
hashMapSet(emitSpecials, stringToSymbol('loop'), emitLoop);
hashMapSet(emitSpecials, stringToSymbol('do'), emitDo);
hashMapSet(emitSpecials, stringToSymbol('yield'), emitYield);
hashMapSet(emitSpecials, stringToSymbol('recur'), emitRecur);
hashMapSet(emitSpecials, stringToSymbol('dict'), emitDict);
hashMapSet(emitSpecials, stringToSymbol('quote'), emitQuote);
hashMapSet(emitSpecials, stringToSymbol('js/return'), emitReturn);
hashMapSet(emitSpecials, stringToSymbol('js/throw'), emitThrow);
hashMapSet(emitSpecials, stringToSymbol('js/new'), emitNew);
hashMapSet(emitSpecials, stringToSymbol('nth'), emitIndex);
require('source-map-support/register');
let fs = require('fs');
let path = require('path');
let escodegen = require('escodegen');
let terser = require('terser');
let program = require('commander').program;
program.option('-o, --output <filename>', 'Output JS filename');
program.option('-m, --map', 'Generate source maps');
program.parse(process.argv);
{
    let outputFilename = program.output, outputDirname = (() => {
            if (outputFilename)
                return path.dirname(outputFilename);
            else {
                return;
            }
        })(), sourceMapFilename = (() => {
            if (program.map)
                if (outputFilename)
                    return path.basename(outputFilename) + '.map';
                else
                    return 'inline';
            else {
                return;
            }
        })(), code = fs.readFileSync(0, 'utf-8'), forms = stringToExprs(code), ast = emitModule(forms), output = escodegen.generate(ast, {
            'sourceMap': 'stdin',
            'sourceMapWithCode': true,
            'sourceContent': code
        }), sourceMap = output.map.toString();
    if (output.error)
        console.error(output.error);
    else if (outputFilename) {
        fs.writeFileSync(outputFilename, output.code);
        if (sourceMapFilename && sourceMapFilename !== 'inline')
            fs.writeFileSync(path.join(outputDirname, sourceMapFilename), output.map.toString());
        else {
        }
    } else
        println(output.code);
}