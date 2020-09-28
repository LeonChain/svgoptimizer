## Installation

```sh
$ [sudo] npm install -g optsvg
```

## Usage

### <abbr title="Command Line Interface">CLI</abbr>

```
Usage:
  optsvg [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Version
  -i INPUT, --input=INPUT : Input file, "-" for STDIN
  -s STRING, --string=STRING : Input SVG data string
  -f FOLDER, --folder=FOLDER : Input folder, optimize and rewrite all *.svg files
  -o OUTPUT, --output=OUTPUT : Output file or folder (by default the same as the input), "-" for STDOUT
  -p PRECISION, --precision=PRECISION : Set number of digits in the fractional part, overrides plugins params
  --config=CONFIG : Config file or JSON string to extend or replace default
  --disable=PLUGIN : Disable plugin by name, "--disable=PLUGIN1,PLUGIN2" for multiple plugins
  --enable=PLUGIN : Enable plugin by name, "--enable=PLUGIN3,PLUGIN4" for multiple plugins
  --datauri=DATAURI : Output as Data URI string (base64, URI encoded or unencoded)
  --multipass : Pass over SVGs multiple times to ensure all optimizations are applied
  --pretty : Make SVG pretty printed
  --indent=INDENT : Indent number when pretty printing SVGs
  -r, --recursive : Use with '-f'. Optimizes *.svg files in folders recursively.
  -q, --quiet : Only output error messages, not regular status messages
  --show-plugins : Show available plugins and exit

Arguments:
  INPUT : Alias to --input
```

-   with files:

    ```sh
    $ optsvg test.svg
    ```

    or:

    ```sh
    $ optsvg *.svg
    ```

    ```sh
    $ optsvg test.svg -o test.min.svg
    ```

    ```sh
    $ optsvg test.svg other.svg third.svg
    ```

    ```sh
    $ optsvg test.svg other.svg third.svg -o test.min.svg -o other.min.svg -o third.min.svg
    ```

-   with STDIN / STDOUT:

    ```sh
    $ cat test.svg | optsvg -i - -o - > test.min.svg
    ```

-   with folder

    ```sh
    $ optsvg -f ../path/to/folder/with/svg/files
    ```

    or:

    ```sh
    $ optsvg -f ../path/to/folder/with/svg/files -o ../path/to/folder/with/svg/output
    ```

    ```sh
    $ optsvg *.svg -o ../path/to/folder/with/svg/output
    ```

-   with strings:

    ```sh
    $ optsvg -s '<svg version="1.1">test</svg>' -o test.min.svg
    ```

    or even with Data URI base64:

    ```sh
    $ optsvg -s 'data:image/svg+xml;base64,...' -o test.min.svg
    ```

-   with SVGZ:

    from `.svgz` to `.svg`:

    ```sh
    $ gunzip -c test.svgz | optsvg -i - -o test.min.svg
    ```

    from `.svg` to `.svgz`:

    ```sh
    $ optsvg test.svg -o - | gzip -cfq9 > test.svgz
    ```
