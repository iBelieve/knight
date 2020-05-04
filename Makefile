SRC := knight/core.kn knight/reader.kn knight/compiler.kn knight/main.kn

all: knight.js

clean:
	rm -r build

knight.js: $(SRC)
	mkdir -p build
	cat $(SRC) | node knight.js > build/knight.js
	cat $(SRC) | node build/knight.js > build/knight-compiled1.js
	cat $(SRC) | node build/knight-compiled1.js > build/knight-compiled2.js
	diff build/knight-compiled1.js build/knight-compiled2.js
	mv build/knight-compiled1.js $@
	chmod +x $@

bootstrap: knight.scm $(SRC)
	cat $(SRC) | csi -keyword-style prefix -s knight.scm > knight.js
	chmod +x knight.js
