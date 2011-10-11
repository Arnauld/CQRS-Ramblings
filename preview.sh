#!/usr/bin/env ruby
raise "gime a file!!" unless ARGV[0]
require "rubygems"
require "redcarpet"

content = File.open(ARGV[0],"r:UTF-8") { |f| f.read }
markdown = Redcarpet.new(content, :fenced_code)
puts <<-eos
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link href="https://a248.e.akamai.net/assets.github.com/stylesheets/bundle_github.css?62f49e5e0d3d1f779d29540cb376b030a6f6acd6" media="screen" rel="stylesheet" type="text/css" /> 
</head>
<body style="margin:50px;">
<div class="wikistyle">
  #{markdown.to_html}
</div>
</body>
</html>
eos
