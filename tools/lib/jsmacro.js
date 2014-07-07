
function MacroEngine(options) {
  this.options = options || {};
  var regex = this.options.regex = this.options.regex || {};

  this.save_expected_failures = false;
  this.re_else_pattern = '//[\@|#]else';
  

  // Compile the main patterns
  this.re_else_macro = /\/\/[\@|#]else/i;
  
  this.re_define_macro = /(\s*\/\/[\@|#]define\s*)(\w*)\s*(\w*)/ig;

  this.re_date_sub_macro = /[\@|#]\_\_date\_\_/i;
  this.re_time_sub_macro = /[\@|#]\_\_time\_\_/i;
  this.re_datetime_sub_macro = /[\@|#]\_\_datetime\_\_/i;

  this.re_stripline_macro = regex.strip || /(.*)\/\/[\@|#]strip.*/ig;

  /* A wrapped macro takes the following form:
   //@MACRO <ARGUMENTS>
   ...some code
  //@end
  */
  
  this.re_wrapped_macro = /(\s*\/\/[\@|#])([a-z]+)\s+(\w*?\s)([\s\S]*?)(\s*\/\/[\@|#]end)(if)?/mg;

  this.reset();
  
};

MacroEngine.prototype.reset = function() {
  this.env = {};
}

MacroEngine.prototype.handle_define = function(key, value) {
  if (this.env[key]) {
    return;
  }
  if (value === undefined) value = '1';
  if (value === '0' || value === 'false') value = 0;
  this.env[key] = value;
 // console.log("JSMACRO: key: " + key + " value: " + value);
}

MacroEngine.prototype.handle_if = function(arg, text) {
  /*
  Returns the text to output based on the value of 'arg'.  E.g., if arg evaluates to false,
  expect to get an empty string back.

  @param    arg    String    Statement found after the 'if'. Currently expected to be a variable (i.e., key) in the env dictionary.
  @param    text   String    The text found between the macro statements
  */
  
  // To handle the '//@else' statement, we'll split text on the statement.
  var parts = text.split(this.re_else_macro);

 // if (!this.env.hasOwnProperty(arg)) {
 //   return ''; //"\n" + text;
 // }
  
  if (this.env[arg]) {
  //  console.log(arg + " is truthy, including content: " + text);
    return "\n" + (parts.length ? parts[0] : text);
  } else {
   // console.log(arg + " is falsey, excluding content: " + text);
    return (parts.length > 1) ? parts[1] : '';
  }  
}

MacroEngine.prototype.handle_ifdef = function(arg, text) {
  /*
  @param    arg    String    Statement found after the 'ifndef'. Currently expected to be a variable (i.e., key) in the env dictionary.
  @param    text   String    The text found between the macro statements

  An ifndef is true if the variable 'arg' does not exist in the environment.
  */
  var parts = text.split(this.re_else_macro);

  if (this.env.hasOwnProperty(arg)) {
    return "\n" + parts[0];

  } else {
    return (parts.length > 1) ? parts[1] : '';
  }
}


MacroEngine.prototype.handle_ifndef = function(arg, text) {
  /*
  @param    arg    String    Statement found after the 'ifndef'. Currently expected to be a variable (i.e., key) in the env dictionary.
  @param    text   String    The text found between the macro statements

  An ifndef is true if the variable 'arg' does not exist in the environment.
  */
  var parts = text.split(this.re_else_macro);

  if (this.env.hasOwnProperty(arg)) {
      return (parts.length > 1) ? parts[1] : '';
  } else {
    assert(parts.length);
    return "\n" + parts[0];
  }
}
/*
MacroEngine.prototype.handle_strip = function(arg, text) {
  if (this.options.strip !== false) {
    console.error("handle_strip: why are we being called?");
  }
  return "\n" + text;
}*/

MacroEngine.prototype.handle_macro = function(info) {
  var method = info[2];
  var args = info[3].trim();
  var code = "\n" + info[4];

  /*
  # This is a fun line.  We construct a method name using the
  # string found in the regex, and call that method on self
  # with the arguments we have.  So, we can dynamically call
  # methods... (and eventually, we'll support adding methods
  # at runtime :-)
  */
  var func = this["handle_" + method];
  assert(func, "No handler for macro: " + method);
  
  return func.apply(this, [args, code]);
  
  //return getattr(self, "handle_%s" % method)(args, code)
}

MacroEngine.prototype.parse = function(text) {
  var now = new Date();
  var info;
  var post = "";
  var idx = 0;
  
 // fp = open(file_name, 'r')
 // text = fp.read()
 // fp.close()

  //# Replace supported __foo__ statements
 // text = self.re_date_sub_macro.sub('%s' % (now.strftime("%b %d, %Y")),
 //   self.re_time_sub_macro.sub('%s' % (now.strftime("%I:%M%p")),
 //   self.re_datetime_sub_macro.sub('%s' % (now.strftime("%b %d, %Y %I:%M%p")), text)))

  //# Parse for DEFINE statements
  var key, val;
  while ((info = this.re_define_macro.exec(text)) !== null) {
     key = info[2];
     val = info[3];
     this.handle_define(key, val);
   }
  
/*  for mo in self.re_define_macro.finditer(text):
    if mo:
      k = mo.group(2) # key
      v = mo.group(3) # value

      self.handle_define(k, v)
*/
  
 // # Delete the DEFINE statements
  text = text.replace(this.re_define_macro, '');
  //text = self.re_define_macro.sub('', text)



  if (this.options.strip !== false) {
    //# Drop any lines containing a //@strip statement
    text = text.replace(this.re_stripline_macro, '');
  }
  else {
    //console.log("NOT processing strip line statements");
    text = text.replace(this.re_stripline_macro, '$1');
  }
  

  while ((info = this.re_wrapped_macro.exec(text)) !== null) {
   // console.log("GOT INFO!: " + Debug.obj(info));
    assert(info.index >= idx);
    post += text.substring(idx, info.index);
    post += this.handle_macro(info);
    idx = this.re_wrapped_macro.lastIndex;
  }
  post += text.substring(idx);
  text = post;
  

 // # Do the magic...
 /* var matches = text.match(this.re_wrapped_macro);
  if (!matches) {
    console.log("NO matches for macro in");
  } else {
    for (var i = 0; i < matches.length; i++) {
      Debug.obj(matches);
      //this.handle_macro(matches[i])
    }
  }*/
 // text = self.re_wrapped_macro.sub(self.handle_macro, text)


  
  return text;
}

module.exports = MacroEngine;