#!/usr/bin/env ruby


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

def check_syntax()
	puts ""
  	puts "Check syntax"
  	puts "--------------------------"
	Dir.glob("lib/**/*.js") do |filename|  
 		jslint_check(filename)
	end
  puts ""
end

def test()
  puts ""
  puts "Start tests"
  puts "--------------------------"
  system("node_modules/.bin/nodeunit test")
end

def it()
  puts ""
  puts "Start integration-tests"
  puts "--------------------------"
  system("node_modules/.bin/nodeunit it")
end

command = ARGV[0] ? ARGV[0] : "all"
case command
  when "it"
    it()
	when "syntax"
		check_syntax()
	when "test"
		test()
	when "all"
		check_syntax()
		test()
end
