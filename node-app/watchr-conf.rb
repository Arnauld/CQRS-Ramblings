watch('^(lib/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  test()
  specs()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

watch('^(test/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  test()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

watch('^(specs/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
  specs()
  puts Time.now.strftime("%Y-%m-%d %H:%M:%S")
end

def jslint_check(files_to_check)
  #system('clear')
  puts ""
  puts "Checking #{files_to_check}"
  puts "--------------------------"
  system("node_modules/.bin/jslint #{files_to_check}")
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