watch('^(lib/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  test()
  specs()
end

watch('^(test/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  test()
end

watch('^(specs/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  specs()
end

def jslint_check(files_to_check)
  #system('clear')
  puts "Checking #{files_to_check}"
  puts "--------------------------"
  system("node_modules/.bin/jslint #{files_to_check}")
end

def test()
  puts "Start tests"
  puts "--------------------------"
  system("node_modules/.bin/nodeunit test")
end

def specs()
  puts "Start behavior tests"
  puts "--------------------------"
  system("node_modules/.bin/vows --spec specs/*")
end