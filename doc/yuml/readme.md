Transform all *.yuml into png

Go into the 'yuml' folder then
    
    $ node yuml2png.js [-v]

then output should be similar to

    Scanning /Users/arnauld/Projects/cqrs-ramblings/doc/yuml
    Generated: ../images/overall-domain-01.png

images are then available in '../images', `png` name is the same as its corresponding `yuml`

options:

* `-v` activate verbose mode


See [yUml](http://yuml.me/diagram/scruffy/class/draw) to an easy facilities to draw diagrams.