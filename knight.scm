;;; A simple Knight-to-JS compiler used for bootstrapping

(import (chicken keyword))
(import (chicken format))
(import (chicken io))
(import (chicken irregex))
(import srfi-1)  ; list functions
(import srfi-13) ; string functions
(import srfi-69) ; hash tables
(import srfi-113) ; sets and bags
(import srfi-128) ; comparators
(import arrays)
(import simple-exceptions)

(define js-keywords (set (make-equal-comparator) "var" "let" "const"))

(define nil '())

(define var-not-found-exn (make-exception "Variable not found" 'var-not-found))

(define empty-op-exn (make-exception "Empty operator call" 'empty-op))

(define internal-exn (make-exception "Internal error" 'internal))

(define (tagged-list? exp tag)
  (and (pair? exp)
       (eq? (car exp) tag)))

(define analyze-specials (make-hash-table))

(define (make-env)
  (list :variables (make-hash-table)
        :recur-variables nil))

(define (child-env env)
  (list :variables (hash-table-copy (get-keyword :variables env))
        :recur-variables (let ([vars (get-keyword :recur-variables env)])
                           (if (not (null? vars)) (array-copy vars) nil))))

(define (recur-env env)
  (list :variables (hash-table-copy (get-keyword :variables env))
        :recur-variables (make-array)))

(define (append-recur-var env var)
  (array-add! var (get-keyword :recur-variables env)))

(define (recur-vars env)
  (array->list (get-keyword :recur-variables env)))

;; Thread-firsts macro from Clojure.
;; See https://lispdreams.wordpress.com/2016/04/10/thread-first-thread-last-and-partials-oh-my/
(define-syntax ->
  (syntax-rules ()
      ((_ value) value)
      ((_ value (f1 . body) next ...) (-> (f1 value . body) next ...))))

(define (regex-replace string regex . replacements)
  (apply irregex-replace `(,regex ,string . ,replacements)))

(define (regex-replace/all string regex . replacements)
  (apply irregex-replace/all `(,regex ,string . ,replacements)))

(define (replace-special-chars ident)
  (-> ident
    (regex-replace/all "!" "")
    (regex-replace/all "->" "-to-")
    (regex-replace "^(contains.*)\\?$" "" 1)
    (regex-replace "^(has.*)\\?$" "" 1)
    (regex-replace "^(.*)\\?$" "is-" 1)))

(define (js-keyword? ident)
  (set-contains? js-keywords ident))

(define (sanitize-js-keywords ident)
  (if (js-keyword? ident)
    (string-append ident "$")
    ident))

(define (kebabcase->camelcase ident)
  (-> ident
    (replace-special-chars)
    (regex-replace/all "[-_]([a-zA-Z])" (lambda (m) (string-upcase (irregex-match-substring m 1))))
    (sanitize-js-keywords)))

(define (symbol->ident symbol)
  (cond
    [(eq? symbol '=) "isEqual"]
    [(eq? symbol 'Symbol) "LispSymbol"]
    [else (kebabcase->camelcase (symbol->string symbol))]))

(define (define-variable env symbol)
  (let ([variables (get-keyword :variables env)])
    (if (not (hash-table-exists? variables symbol))
      (hash-table-set! variables symbol (symbol->ident symbol)))
    (hash-table-ref variables symbol)))

(define (define-function env symbol)
  (let ([variables (get-keyword :variables env)])
    (if (not (hash-table-exists? variables symbol))
      (hash-table-set! variables symbol (symbol->ident symbol)))
    (hash-table-ref variables symbol)))

(define (predefine-function env symbol)
  (let ([variables (get-keyword :variables env)])
    (if (not (hash-table-exists? variables symbol))
      (hash-table-set! variables symbol (symbol->ident symbol)))
    (hash-table-ref variables symbol)))

(define (resolve-variable env symbol)
  (if (string-prefix? "js/" (symbol->string symbol))
    (substring/shared (symbol->string symbol) 3)
    (let ([variables (get-keyword :variables env)])
      (if (not (hash-table-exists? variables symbol))
        (raise (var-not-found-exn 'resolve-variable symbol)))
      (hash-table-ref variables symbol))))

(define (print-return ctx)
  (if (eq? ctx :return)
    (printf "return ")))

(define (print-end ctx)
  (if (or (eq? ctx :statement) (eq? ctx :return))
    (printf ";")))

(define (field-access? form)
  (and (symbol? form)
       (string-prefix? ".-" (symbol->string form))))

(define (method-call? form)
  (and (symbol? form)
       (string-prefix? "." (symbol->string form))))

(define (special? form)
  (and (symbol? form)
       (hash-table-exists? analyze-specials form)))

(define (for-each-enumerated func list)
  (unless (null-list? list)
    (let loop ([index 0]
               [list list])
      (let* ([item (car list)]
             [rest (cdr list)]
             [first? (= index 0)]
             [last? (null-list? rest)])
        (func item index first? last?)
        (unless last?
          (loop (add1 index)
                rest))))))

(define (emit-many env ctx forms sep)
  (for-each-enumerated
    (lambda (form index first? last?)
      (let ([ctx (case ctx
                   [(:statement :expr) ctx]
                   [(:return) (if last? :return :statement)]
                   [else (raise (internal-exn 'emit-many ctx))])])
        (emit env ctx form)
        (if (and (not (string-null? sep)) (not last?))
          (printf "~a" sep))))
    forms))

(define (emit env ctx form)
  (cond
    [(eq? form 'nil) (emit-literal env ctx nil)]
    [(eq? form 'true) (emit-literal env ctx #t)]
    [(eq? form 'false) (emit-literal env ctx #f)]
    [(symbol? form) (emit-var env ctx form)]
    [(list? form) (emit-list env ctx form)]
    [else (emit-literal env ctx form)]))

(define (emit-var env ctx symbol)
  (let ([name (resolve-variable env symbol)])
    (print-return ctx)
    (printf "~a" name)
    (print-end ctx)))

(define (emit-literal env ctx form)
  (print-return ctx)
  (cond
    [(null? form) (printf "null")]
    [(eq? #t form) (printf "true")]
    [(eq? #f form) (printf "false")]
    [(char? form)
     (case form
       [(#\\) (printf "\"\\\\\"")]
       [(#\") (printf "\"\\\"\"")]
       [(#\newline) (printf "\"\\n\"")]
       [(#\return) (printf "\"\\r\"")]
       [(#\tab) (printf "\"\\t\"")]
       [(#\space) (printf "\" \"")]
       [else (printf "\"~a\"" form)])]
    [(keyword? form) (printf "stringToKeyword(\"~a\")" (keyword->string form))]
    [else (printf "~s" form)])
  (print-end ctx))

(define (emit-list env ctx form)
  (let ([callable (car form)]
        [args (cdr form)])
    (cond
      [(field-access? callable) (emit-field env ctx callable args)]
      [(method-call? callable) (emit-methodcall env ctx callable args)]
      [(special? callable) ((hash-table-ref analyze-specials callable) env ctx args)]
      [else (emit-funcall env ctx callable args)])))

(define (emit-methodcall env ctx callable args)
  (let ([method-name (substring/shared (symbol->string callable) 1)]
        [obj (car args)]
        [args (cdr args)])
    (print-return ctx)
    (emit env :expr obj)
    (printf ".~a(" method-name)
    (emit-many env :expr args ",")
    (printf ")")
    (print-end ctx)))

(define (emit-funcall env ctx callable args)
  (print-return ctx)
  (emit env :expr callable)
  (printf "(")
  (emit-many env :expr args ",")
  (printf ")")
  (print-end ctx))

(define (emit-field env ctx callable args)
  (let ([field-name (substring/shared (symbol->string callable) 2)]
        [obj (car args)])
    (print-return ctx)
    (emit env :expr obj)
    (printf ".~a" field-name)
    (print-end ctx)))

(define (emit-def env ctx args)
  (unless (eq? ctx :statement)
    (raise (knight-exn)))
  (let ([var-name (define-variable env (car args))]
        [init-form (if (cdr args) (cadr args))])
    (printf "let ~a=" var-name)
    (if init-form
      (emit env :expr init-form))
    (printf ";")))

(hash-table-set! analyze-specials 'def emit-def)

(define (emit-index env ctx args)
  (let ([obj (car args)]
        [index (cadr args)])
    (print-return ctx)
    (emit env :expr obj)
    (printf "[")
    (emit env :expr index)
    (printf "]")
    (print-end ctx)))

(hash-table-set! analyze-specials 'js/index emit-index)

(define (emit-let env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (let ([vars (car args)]
        [body (cdr args)]
        [env (child-env env)])
    (let loop ([vars vars])
      (if (not (null-list? vars))
        (let ([var (car vars)]
              [value (cadr vars)]
              [rest (cddr vars)])
          (if (list? var)
            (printf "let [~a]=" (string-join (map (lambda (var) (define-variable env var)) var) ","))
            (printf "let ~a=" (define-variable env var)))
          (emit env :expr value)
          (printf ";")
          (loop rest))))
    (emit-many env ctx body "")))

(hash-table-set! analyze-specials 'let emit-let)

(define (emit-obj env ctx args)
  (print-return ctx)
  (printf "{")
  (let loop ([args args])
    (if (not (null-list? args))
      (let ([key (car args)]
            [value (cadr args)]
            [rest (cddr args)])
        (printf "\"~a\":" key)
        (emit env :expr value)
        (printf ",")
        (loop rest))))
  (printf "}")
  (print-end "}"))

(hash-table-set! analyze-specials 'js/obj emit-obj)

(define (emit-cond env ctx args)
  (if (eq? ctx :expr)
    (printf "(()=>{"))
  (for-each-enumerated
    (lambda (expr index first? last?)
      (let ([test (car expr)]
            [body (cdr expr)])
        (if (not first?)
          (printf "else "))
        (if (eq? test 'else)
          (printf "{")
          (begin
            (printf "if(")
            (emit env :expr test)
            (printf "){")))
        (emit-many env (statement-ctx ctx) body "")
        (printf "}")))
    args)
  (if (eq? ctx :expr)
    (printf "})()")))

(hash-table-set! analyze-specials 'cond emit-cond)

(define (emit-new env ctx args)
  (let ([callable (car args)]
        [args (cdr args)])
    (print-return ctx)
    (printf "new ")
    (emit env :expr callable)
    (printf "(")
    (emit-many env :expr args ",")
    (printf ")")
    (print-end ctx)))

(hash-table-set! analyze-specials 'js/new emit-new)

(define (single-list? list)
  (and (pair? list)
       (null-list? (cdr list))))

(define (emit-if env ctx args)
  (let ([test (car args)]
        [if-true (cadr args)]
        [if-false (cddr args)])
    (if (eq? ctx :expr)
      (begin
        (emit env :expr test)
        (printf "?")
        (emit env :expr if-true)
        (printf ":")
        (cond
          [(null-list? if-false)
           (printf "null")]
          [(single-list? if-false)
           (emit env :expr (car if-false))]
          [else
           (printf "(")
           (emit-many env :expr if-false ",")
           (printf ")")]))
      (begin
        (printf "if(isTruthy(")
        (emit env :expr test)
        (printf ")){")
        (emit env ctx if-true)
        (if (not (null-list? if-false))
          (begin
            (printf "}else{")
            (emit-many env ctx if-false "")
            (printf "}"))
          (if (eq? ctx :return)
            (printf "}else{return;}")
            (printf "}")))))))

(hash-table-set! analyze-specials 'if emit-if)

(define (emit-for env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (let ([var (car args)]
        [body (cdr args)]
        [env (child-env env)])
    (printf "for(")
    (let ([var (car var)]
          [value (cadr var)])
      (if (list? var)
        (printf "let [~a]of " (string-join (map (lambda (var) (define-variable env var)) var) ","))
        (printf "let ~a of " (define-variable env var)))
      (emit env :expr value))
    (printf "){")
    (emit-many env :statement body "")
    (printf "}")))

(hash-table-set! analyze-specials 'for emit-for)

(define (emit-return env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (if (null-list? args)
    (printf "return;")
    (emit env :return (car args))))

(hash-table-set! analyze-specials 'js/return emit-return)

(define (emit-yield env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (printf "yield ")
  (emit env :expr (car args))
  (printf ";"))

(hash-table-set! analyze-specials 'yield emit-yield)

(define (emit-throw env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (printf "throw ")
  (emit env :expr (car args))
  (printf ";"))

(hash-table-set! analyze-specials 'js/throw emit-throw)

(define (emit-recur env ctx args)
  (if (eq? ctx :expr)
    (raise (knight-exn)))
  (for-each
    (lambda (var)
      (printf "~a=" (car var))
      (emit env :expr (cadr var))
      (printf ";"))
    (zip (recur-vars env) args))
  (printf "continue;"))

(hash-table-set! analyze-specials 'recur emit-recur)

(define (emit-set env ctx args)
  (unless (eq? ctx :statement)
    (raise (knight-exn)))
  (let ([setter (car args)]
        [value (cadr args)])
    (cond
      [(symbol? setter) (emit-set-var env setter value)]
      [(list? setter) (emit-setter env setter value)]
      [else (raise (invalid-setter-exn 'emit-set setter))])))

(define (emit-setter env setter value)
  (let ([callable (car setter)]
        [args (cdr setter)])
    (cond
      [(field-access? callable) (emit-set-field env callable args value)]
      [else (raise (invalid-setter-exn 'emit-set setter))])))

(define (emit-set-var env symbol value)
  (let ([name (resolve-variable env symbol)])
    (printf "~a=" name)
    (emit env :expr value)
    (printf ";")))

(define (emit-set-field env symbol args value)
  (let ([field-name (substring/shared (symbol->string symbol) 2)]
        [obj (car args)])
    (emit env :expr obj)
    (printf ".~a=" field-name)
    (emit env :expr value)
    (printf ";")))

(hash-table-set! analyze-specials 'set! emit-set)

(define (emit-defn env ctx args)
  (unless (eq? ctx :statement)
    (raise (knight-exn)))
  (let* ([func-name (define-function env (car args))]
         [params (cadr args)]
         [docs (if (and (not (null-list? (cddr args)))
                        (string? (caddr args))
                        (not (null-list? (cdddr args))))
                 (caddr args)
                 nil)]
         [body (if (not (null? docs)) (cdddr args) (cddr args))]
         [env (child-env env)])
    (printf "function ~a(" func-name)
    (for-each-enumerated
      (lambda (param index first? last?)
        (if (tagged-list? param 'spread)
          (printf "...~a" (define-variable env (cadr param)))
          (printf "~a" (define-variable env param)))
        (unless last?
          (printf ",")))
      params)
    (printf "){")
    (emit-many env :return body "")
    (printf "}")))

(hash-table-set! analyze-specials 'defn emit-defn)

(define (emit-defgen env ctx args)
  (unless (eq? ctx :statement)
    (raise (knight-exn)))
  (let* ([func-name (define-function env (car args))]
         [params (cadr args)]
         [docs (if (and (not (null-list? (cddr args)))
                        (string? (caddr args))
                        (not (null-list? (cdddr args))))
                 (caddr args)
                 nil)]
         [body (if (not (null? docs)) (cdddr args) (cddr args))]
         [env (child-env env)])
    (printf "function* ~a(" func-name)
    (for-each-enumerated
      (lambda (param index first? last?)
        (if (tagged-list? param 'spread)
          (printf "...~a" (define-variable env (cadr param)))
          (printf "~a" (define-variable env param)))
        (unless last?
          (printf ",")))
      params)
    (printf "){")
    (emit-many env :return body "")
    (printf "}")))

(hash-table-set! analyze-specials 'defgen emit-defgen)

(define (emit-do env ctx args)
  (printf "{")
  (emit-many env ctx args "")
  (printf "}"))

(hash-table-set! analyze-specials 'do emit-do)

(define (emit-fn env ctx args)
  (print-return ctx)
  (let* ([params (car args)]
         [body (cdr args)]
         [env (child-env env)])
    (printf "(")
    (for-each-enumerated
      (lambda (param index first? last?)
        (if (tagged-list? param 'spread)
          (printf "...~a" (define-variable env (cadr param)))
          (printf "~a" (define-variable env param)))
        (unless last?
          (printf ",")))
      params)
    (printf ")=>{")
    (emit-many env :return body "")
    (printf "}"))
  (print-end ctx))

(hash-table-set! analyze-specials 'fn emit-fn)

(define (statement-ctx ctx)
  (if (eqv? ctx #:statement)
    #:statement
    #:return))

(define (emit-loop env ctx args)
  (if (eq? ctx :expr)
    (printf "(()=>{"))
  (let ([vars (car args)]
        [body (cdr args)]
        [env (recur-env env)])
    (let loop ([vars vars])
      (if (not (null-list? vars))
        (let ([name (define-variable env (car vars))]
              [value (cadr vars)]
              [rest (cddr vars)])
          (append-recur-var env name)
          (printf "let ~a=" name)
          (emit env :expr value)
          (printf ";")
          (loop rest))))
    (printf "while(true){")
    (emit-many env :return body ""))
  (printf "}")
  (if (eq? ctx :expr)
    (printf "})()")))

(hash-table-set! analyze-specials 'loop emit-loop)

(define (emit-array env ctx args)
  (print-return ctx)
  (printf "[")
  (emit-many env :expr args ",")
  (printf "]")
  (print-end ctx))

(hash-table-set! analyze-specials 'js/array emit-array)

(define (emit-spread env ctx args)
  (unless (eq? ctx :expr)
    (raise (knight-exn)))
  (printf "...")
  (emit env :expr (car args)))

(hash-table-set! analyze-specials 'spread emit-spread)

(define (emit-or env ctx args)
  (if (null-list? args)
    (raise (empty-op-exn 'emit-op "or")))
  (print-return ctx)
  (for-each-enumerated
    (lambda (arg index first? last?)
      (unless last?
        (printf "isTruthy"))
      (printf "(")
      (emit env :expr arg)
      (printf ")")
      (unless last?
        (printf "||")))
    args)
  (print-end ctx))

(hash-table-set! analyze-specials 'or emit-or)

(define (emit-and env ctx args)
  (if (null-list? args)
    (raise (empty-op-exn 'emit-op "and")))
  (print-return ctx)
  (for-each-enumerated
    (lambda (arg index first? last?)
      (unless last?
        (printf "isTruthy"))
      (printf "(")
      (emit env :expr arg)
      (printf ")")
      (unless last?
        (printf "&&")))
    args)
  (print-end ctx))

(hash-table-set! analyze-specials 'and emit-and)

(define (emit-quote env ctx args)
  (emit env ctx (knight-quote (car args))))

(hash-table-set! analyze-specials 'quote emit-quote)

(define (emit-op op)
  (lambda (env ctx args)
    (if (null-list? args)
      (raise (empty-op-exn 'emit-op op)))
    (print-return ctx)
    (for-each-enumerated
      (lambda (arg index first? last?)
        (printf "(")
        (emit env :expr arg)
        (printf ")")
        (unless last?
          (printf op)))
      args)
    (print-end ctx)))

(hash-table-set! analyze-specials 'js/and (emit-op "&&"))
(hash-table-set! analyze-specials 'js/or (emit-op "||"))
(hash-table-set! analyze-specials 'js/== (emit-op "=="))
(hash-table-set! analyze-specials 'js/!= (emit-op "!="))
(hash-table-set! analyze-specials 'js/=== (emit-op "==="))
(hash-table-set! analyze-specials 'js/!== (emit-op "!=="))
(hash-table-set! analyze-specials '= (emit-op "==="))
(hash-table-set! analyze-specials '!= (emit-op "!=="))
(hash-table-set! analyze-specials '> (emit-op ">"))
(hash-table-set! analyze-specials '< (emit-op "<"))
(hash-table-set! analyze-specials '<= (emit-op "<="))
(hash-table-set! analyze-specials '>= (emit-op ">="))
(hash-table-set! analyze-specials '+ (emit-op "+"))
(hash-table-set! analyze-specials '- (emit-op "-"))
(hash-table-set! analyze-specials '* (emit-op "*"))
(hash-table-set! analyze-specials '/ (emit-op "/"))
(hash-table-set! analyze-specials 'js/instanceof (emit-op "instanceof"))

(define (emit-module exprs)
  (let ([env (make-env)])
    (for-each
      (lambda (expr)
        (if (tagged-list? expr 'defn)
          (predefine-function env (cadr expr))))
      exprs)
    (emit-many env :statement exprs "\n")))

(define (knight-quote form)
  (cond
    [(symbol? form) (list 'string->symbol (symbol->string form))]
    [(list? form) (append (list 'js/array) (map knight-quote form))]
    [else form]))

(let ([src (read-list)])
  (emit-module src)
  (newline))
