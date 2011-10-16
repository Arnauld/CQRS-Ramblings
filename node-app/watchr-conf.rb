watch('^(lib/(.*)\.js)') do |m|
  separator()
  jslint_check("#{m[1]}")
  test()
  specs()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

watch('^(test/(.*)\.js)') do |m|
  separator()
  jslint_check("#{m[1]}")
  test()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

watch('^(specs/(.*)\.js)') do |m|
  separator()
  jslint_check("#{m[1]}")
  specs()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

def separator
  puts "------------------------------------------------------------------"
end

def jslint_check(files_to_check)
  # If you surround your command with backticks, then you don't need to (explicitly) call system() at all. 
  # The backticks execute the command and return the output as a string.
  output = `node_modules/.bin/jslint #{files_to_check}`
  if(output.include? 'No errors found.')
    puts "✓ [#{files_to_check}]"
  else
    puts "✗ [#{files_to_check}] \n #{output}"
  end
end

def test()
  puts ""
  puts "Start tests"
  puts "--------------------------"
  system("node_modules/.bin/nodeunit test")
end

def specs()
  puts ""
  puts "Start behavior tests"
  puts "--------------------------"
  system("node_modules/.bin/vows --spec specs/*")
end