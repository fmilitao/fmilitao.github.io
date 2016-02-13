
Stuff I need to write down before I forget how to use...

## Generate this page

1. For listening to changes (launches local http server, auto-refreshes on FILE changes, opens browser):
  ```bash
  grip --wide --title="Notes on stuff" --user-content -b FILE
  ```

2. For generating standalone html file:
  ```bash
  grip --wide --title="Notes on stuff" --user-content --export FILE
  ```

3. To clean up the ugly line on the bottom left:
  ```bash
  sed -i .bak  's/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";background-color:#f3f3f3}/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";}/g' FILE
  ```

[Grip installation](https://github.com/joeyespo/grip)

## Update local fork

1. Ensure `upstream` points to correct URL (i.e. original owner):
  ```bash
  git remote -v #lists remotes, if no 'upstream' then add manually:
  git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
  ```
[Source](https://help.github.com/articles/configuring-a-remote-for-a-fork/)

2. Fetch and merge, push to origin:
  ```bash
  git fetch upstream
  git checkout master
  git merge upstream/master
  git push origin
  ```
[Source](https://help.github.com/articles/syncing-a-fork/)

## Show current time in terminal prompt

Add line to `.bash_profile` (for mac terminals):
  ```bash
  export PS1="\t$ "
  ```

## Latexmk alias

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

## `gh-pages` branch update

Update github pages branch of a project:
  ```bash
  git checkout gh-pages
  git pull origin gh-pages #sometimes I need this...
  git rebase master
  git push origin gh-pages
  ```
Then return to work branch.

[Source](http://lea.verou.me/2011/10/easily-keep-gh-pages-in-sync-with-master/)


## AFS stuff (Mac OS X)

1. Authentication:
  ```bash
  kinit <username>@CS.CMU.EDU
  aklog cs.cmu.edu -k CS.CMU.EDU
  ```

2. Should have `tokens`
3. When done `unlog`

[Source](http://www.cs.cmu.edu/~help/afs/afs_authentication.html)

### Other stuff

* [On using markdown on github pages](http://stackoverflow.com/questions/15124547/can-i-use-markdown-file-in-github-page)
* [Good JS parser?](http://esprima.org/)
