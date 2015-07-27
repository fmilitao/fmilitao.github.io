<!---
This was for using github's jekyll automatically:
---
title: Remember Mister Sprinkles
layout: post
---
now I am using atom's markdown preview so as to include some css.
--->

#Notes on stuff...#

##Show current time on terminal prompt##

Add line to `.bash_profile` (for mac terminals):
```bash
export PS1="\t$ "
```

##Latex-mk alias##

Add line to `.bash_profile`:
```bash
alias latexmk-pdf='latexmk -pdf -pvc -silent'
```
The `-silent` option may not be sane since errors do not cause abort.
And create `~/.latexmkrc ` on home dir (for use with [Skim](http://skim-app.sourceforge.net/)):
```bash
$pdf_previewer = "open -a /Applications/Skim.app"; $clean_ext = "paux lox pdfsync out";
```
Usage (will watch all files reference by `FILE.tex`):
```bash
latex-pdf FILE.tex
```

[Source](http://jon.smajda.com/2008/03/08/latexmk/)

##gh-pages branch update##

Update 'github pages' branch of a project:
```bash
git checkout gh-pages
git pull origin gh-pages #sometimes I need this... why??
git rebase master
git push origin gh-pages
```

Then return to work branch...

[Source](http://lea.verou.me/2011/10/easily-keep-gh-pages-in-sync-with-master/)

###Misc.###

* [On using markdown on github pages](http://stackoverflow.com/questions/15124547/can-i-use-markdown-file-in-github-page)
* [Good JS parser?](http://esprima.org/)
