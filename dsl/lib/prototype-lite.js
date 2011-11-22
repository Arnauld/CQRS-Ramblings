/**
 * Initially copied from prototype.js library
 * see https://github.com/sstephenson/prototype/blob/master/src/prototype/lang/array.js
 * see https://github.com/sstephenson/prototype/blob/master/src/prototype/lang/string.js
 */



var extend = exports.extend = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

extend(String.prototype, (function() {
  /**
   *  String#strip() -> String
   *
   *  Strips all leading and trailing whitespace from a string.
   *  
   *  ##### Example
   *  
   *      '    hello world!    '.strip();
   *      // -> 'hello world!'
  **/
  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  /**
   *  String#toArray() -> Array
   *
   *  Splits the string character-by-character and returns an array with
   *  the result.
   *
   *  ##### Examples
   *  
   *      'a'.toArray();
   *      // -> ['a']
   *      
   *      'hello world!'.toArray();
   *      // -> ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', '!']
  **/
  function toArray() {
    return this.split('');
  }

  /**
   *  String#times(count) -> String
   *
   *  Concatenates the string `count` times.
   *  
   *  ##### Example
   *  
   *      "echo ".times(3);
   *      // -> "echo echo echo "
  **/
  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  /**
   *  String#camelize() -> String
   *
   *  Converts a string separated by dashes into a camelCase equivalent. For
   *  instance, `'foo-bar'` would be converted to `'fooBar'`.
   *  
   *  Prototype uses this internally for translating CSS properties into their
   *  DOM `style` property equivalents.
   *
   *  ##### Examples
   *
   *      'background-color'.camelize();
   *      // -> 'backgroundColor'
   *
   *      '-moz-binding'.camelize();
   *      // -> 'MozBinding'
  **/
  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }

  /**
   *  String#capitalize() -> String
   *
   *  Capitalizes the first letter of a string and downcases all the others.
   *  
   *  ##### Examples
   *  
   *      'hello'.capitalize();
   *      // -> 'Hello'
   *      
   *      'HELLO WORLD!'.capitalize();
   *      // -> 'Hello world!'
  **/
  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  /**
   *  String#underscore() -> String
   *
   *  Converts a camelized string into a series of words separated by an
   *  underscore (`_`).
   *
   *  ##### Example
   *  
   *      'borderBottomWidth'.underscore();
   *      // -> 'border_bottom_width'
   *  
   *  ##### Note
   *  
   *  Used in conjunction with [[String#dasherize]], [[String#underscore]]
   *  converts a DOM style into its CSS equivalent.
   *  
   *      'borderBottomWidth'.underscore().dasherize();
   *      // -> 'border-bottom-width'
  **/
  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  /**
   *  String#dasherize() -> String
   *
   *  Replaces every instance of the underscore character `"_"` by a dash `"-"`.
   *
   *  ##### Example
   *  
   *      'border_bottom_width'.dasherize();
   *      // -> 'border-bottom-width'
   *  
   *  ##### Note
   *  
   *  Used in conjunction with [[String#underscore]], [[String#dasherize]]
   *  converts a DOM style into its CSS equivalent.
   *  
   *      'borderBottomWidth'.underscore().dasherize();
   *      // -> 'border-bottom-width'
  **/
  function dasherize() {
    return this.replace(/_/g, '-');
  }

  /**
   *  String#include(substring) -> Boolean
   *
   *  Checks if the string contains `substring`.
   *  
   *  ##### Example
   *  
   *      'Prototype framework'.include('frame');
   *      //-> true
   *      'Prototype framework'.include('frameset');
   *      //-> false
  **/
  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  /**
   *  String#startsWith(substring) -> Boolean
   *
   *  Checks if the string starts with `substring`.
   *  
   *  ##### Example
   *  
   *      'Prototype JavaScript'.startsWith('Pro');
   *      //-> true
  **/
  function startsWith(pattern) {
    // We use `lastIndexOf` instead of `indexOf` to avoid tying execution
    // time to string length when string doesn't start with pattern.
    return this.lastIndexOf(pattern, 0) === 0;
  }

  /**
   *  String#endsWith(substring) -> Boolean
   *
   *  Checks if the string ends with `substring`.
   *  
   *  ##### Example
   *  
   *      'slaughter'.endsWith('laughter')
   *      // -> true
  **/
  function endsWith(pattern) {
    var d = this.length - pattern.length;
    // We use `indexOf` instead of `lastIndexOf` to avoid tying execution
    // time to string length when string doesn't end with pattern.
    return d >= 0 && this.indexOf(pattern, d) === d;
  }

  /**
   *  String#empty() -> Boolean
   *
   *  Checks if the string is empty.
   *  
   *  ##### Example
   *  
   *      ''.empty();
   *      //-> true
   *      
   *      '  '.empty();
   *      //-> false  
  **/
  function empty() {
    return this == '';
  }

  /**
   *  String#blank() -> Boolean
   *
   *  Check if the string is "blank" &mdash; either empty (length of `0`) or
   *  containing only whitespace.
   *
   *  ##### Example
   *  
   *      ''.blank();
   *      //-> true
   *      
   *      '  '.blank();
   *      //-> true
   *      
   *      ' a '.blank();
   *      //-> false
  **/
  function blank() {
    return /^\s*$/.test(this);
  }

  return {
    // Firefox 3.5+ supports String.prototype.trim
    // (`trim` is ~ 5x faster than `strip` in FF3.5)
    strip:          String.prototype.trim || strip,
    toArray:        toArray,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    include:        include,
    startsWith:     startsWith,
    endsWith:       endsWith,
    empty:          empty,
    blank:          blank,
  };
})());

(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator, context) {
    for (var i = 0, length = this.length >>> 0; i < length; i++) {
      if (i in this) iterator.call(context, this[i], i, this);
    }
  }
  if (!_each) _each = each;
  
  /**
   *  Array#clear() -> Array
   *
   *  Clears the array (makes it empty) and returns the array reference.
   *
   *  ##### Example
   *
   *      var guys = ['Sam', 'Justin', 'Andrew', 'Dan'];
   *      guys.clear();
   *      // -> []
   *      guys
   *      // -> []
  **/
  function clear() {
    this.length = 0;
    return this;
  }

  /**
   *  Array#head() -> ?
   *
   *  Returns the array's first item (e.g., `array[0]`).
  **/
  function head() {
    return this[0];
  }

  /**
   *  Array#first() -> ?
   *
   *  Returns the array's first item (e.g., `array[0]`).
  **/
  function first() {
    return this[0];
  }

  /**
   *  Array#last() -> ?
   *
   *  Returns the array's last item (e.g., `array[array.length - 1]`).
  **/
  function last() {
    return this[this.length - 1];
  }

  /**
   *  Array#compact() -> Array
   *
   *  Returns a **copy** of the array without any `null` or `undefined` values.
   *
   *  ##### Example
   *
   *      var orig = [undefined, 'A', undefined, 'B', null, 'C'];
   *      var copy = orig.compact();
   *      // orig -> [undefined, 'A', undefined, 'B', null, 'C'];
   *      // copy -> ['A', 'B', 'C'];
  **/
  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }

  /**
   *  Array#without(value[, value...]) -> Array
   *  - value (?): A value to exclude.
   *
   *  Produces a new version of the array that does not contain any of the
   *  specified values, leaving the original array unchanged.
   *
   *  ##### Examples
   *
   *      [3, 5, 6].without(3)
   *      // -> [5, 6]
   *
   *      [3, 5, 6, 20].without(20, 6)
   *      // -> [3, 5]
  **/
  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  /**
   *  Array#reverse([inline = true]) -> Array
   *  - inline (Boolean): Whether to modify the array in place. Defaults to `true`.
   *      Clones the original array when `false`.
   *
   *  Reverses the array's contents, optionally cloning it first.
   *
   *  ##### Examples
   *
   *      // Making a copy
   *      var nums = [3, 5, 6, 1, 20];
   *      var rev = nums.reverse(false);
   *      // nums -> [3, 5, 6, 1, 20]
   *      // rev -> [20, 1, 6, 5, 3]
   *
   *      // Working inline
   *      var nums = [3, 5, 6, 1, 20];
   *      nums.reverse();
   *      // nums -> [20, 1, 6, 5, 3]
  **/
  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }

  /**
   *  Array#uniq([sorted = false]) -> Array
   *  - sorted (Boolean): Whether the array has already been sorted. If `true`,
   *    a less-costly algorithm will be used.
   *
   *  Produces a duplicate-free version of an array. If no duplicates are
   *  found, the original array is returned.
   *
   *  On large arrays when `sorted` is `false`, this method has a potentially
   *  large performance cost.
   *
   *  ##### Examples
   *
   *      [1, 3, 2, 1].uniq();
   *      // -> [1, 2, 3]
   *
   *      ['A', 'a'].uniq();
   *      // -> ['A', 'a'] (because String comparison is case-sensitive)
  **/
  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  /**
   *  Array#intersect(array) -> Array
   *  - array (Array): A collection of values.
   *
   *  Returns an array containing every item that is shared between the two
   *  given arrays.
  **/
  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.detect(function(value) { return item === value });
    });
  }

  /** alias of: Array#clone
   *  Array#toArray() -> Array
  **/

  /**
   *  Array#clone() -> Array
   *
   *  Returns a duplicate of the array, leaving the original array intact.
  **/
  function clone() {
    return slice.call(this, 0);
  }

  /** related to: Enumerable#size
   *  Array#size() -> Number
   *
   *  Returns the size of the array (e.g., `array.length`).
   *
   *  This is just a local optimization of the mixed-in [[Enumerable#size]]
   *  which avoids array cloning and uses the array's native length property.
  **/
  function size() {
    return this.length;
  }

  /**
   *  Array#indexOf(item[, offset = 0]) -> Number
   *  - item (?): A value that may or may not be in the array.
   *  - offset (Number): The number of initial items to skip before beginning
   *      the search.
   *
   *  Returns the index of the first occurrence of `item` within the array,
   *  or `-1` if `item` doesn't exist in the array. `Array#indexOf` compares
   *  items using *strict equality* (`===`).
   *
   *  ##### Examples
   *
   *      [3, 5, 6, 1, 20].indexOf(1)
   *      // -> 3
   *
   *      [3, 5, 6, 1, 20].indexOf(90)
   *      // -> -1 (not found)
   *
   *      ['1', '2', '3'].indexOf(1);
   *      // -> -1 (not found, 1 !== '1')
  **/
  function indexOf(item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
      if (this[i] === item) return i;
    return -1;
  }

  /** related to: Array#indexOf
   *  Array#lastIndexOf(item[, offset]) -> Number
   *  - item (?): A value that may or may not be in the array.
   *  - offset (Number): The number of items at the end to skip before beginning
   *      the search.
   *
   *  Returns the position of the last occurrence of `item` within the array &mdash; or
   *  `-1` if `item` doesn't exist in the array.
  **/
  function lastIndexOf(item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
  }

  extend(arrayProto, {
    _each:     _each,
    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
  });
})();


