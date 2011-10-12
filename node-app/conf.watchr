watch('^(lib/(.*)\.js)') do |m|
  jslint_check("#{m[1]}")
end

def jslint_check(files_to_check)
  # system('clear')
  puts "Checking #{files_to_check}"
  system("node_modules/.bin/jslint #{files_to_check}")
end