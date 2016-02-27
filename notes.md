
Stuff I need to write down before I forget how to use, or to not have to search for it again...

## Git stuff

These generally work best if you have already set [your custom editor](http://stackoverflow.com/questions/2596805/how-do-i-make-git-use-the-editor-of-my-choice-for-commits).

* Edit last commit message:

  ```bash
  git commit --amend
  ```
  [Source](http://stackoverflow.com/questions/179123/edit-an-incorrect-commit-message-in-git)

* Edit last N commits or even squash them together:
  ```bash
  git rebase -i ${COMMIT_ID}    #for where COMMIT_ID is the parent of the last commit to edit.
  git rebase -i HEAD~5    #for previous 5 commits.
  ```
  [Source](http://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git)

  You can get the `${COMMIT_ID}` by looking at the `git log` (or `git log --graph` for easier way to see merges).

* [Git stashing](https://git-scm.com/book/en/v1/Git-Tools-Stashing) to save changes, without committing, and checking other branches, etc.
  ```bash
  git stash     # to stash changes
  ... #stuff you need to do on other branches, for instance
  git stash pop # to apply last stashed change
  ```

* Hard reset (i.e. **LOSING ALL LOCAL CHANGES** unless you stash them first) to fix diverged branch (specially if someone force pushed their changes...):
  ```bash
  git reset --hard ${BRANCH}
  # if necessary:
  git pull
  ```
  [Source](http://stackoverflow.com/questions/2452226/master-branch-and-origin-master-have-diverged-how-to-undiverge-branches), [Source](http://stackoverflow.com/questions/4157189/git-pull-while-ignoring-local-changes).

* Pushing local branches to origin while also setting upstream:
  ```bash
  git push -u origin ${BRANCH}
  ```
  [Source](http://stackoverflow.com/questions/6089294/why-do-i-need-to-do-set-upstream-all-the-time)

* Checkout files from specific branches:
  ```bash
  git checkout ${BRANCH} -- ${PATH_TO_FILE}
  ```
  [Source](http://nicolasgallagher.com/git-checkout-specific-files-from-another-branch/)

* Keep theirs/ours version of files in merge conflicts:
  ```bash
  git checkout --ours ${FILE}    # uses version we have
  git checkout --theirs ${FILE}  # uses version to be merged in
  ```
  [Source](http://gitready.com/advanced/2009/02/25/keep-either-file-in-merge-conflicts.html)

## Docker stuff

* [Get bash or ssh into running container](http://askubuntu.com/questions/505506/how-to-get-bash-or-ssh-into-a-running-container-in-background-mode):

  ```bash
  $ sudo docker exec -i -t ${CONTAINER_ID} bash
  # or
  $ sudo docker exec -i -t ${CONTAINER_NAME} bash
  ```

* Name the container using the `--name ${CONTAINER_NAME}` flag when running (auto-gen names are usually cool, though).

* Get a running container's ip address:
  ```bash
  docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${CONTAINER_ID}
  ```
  [Source](http://stackoverflow.com/questions/17157721/getting-a-docker-containers-ip-address-from-the-host)

* [Docker cheat sheet](https://github.com/wsargent/docker-cheat-sheet).

## Generate this page

1. For listening to changes (launches local http server, auto-refreshes on FILE changes, opens browser):
  ```bash
  grip --wide --title="Notes on stuff" --user-content -b ${FILE}
  ```

2. For generating standalone html file:
  ```bash
  grip --wide --title="Notes on stuff" --user-content --export ${FILE}
  ```

3. To clean up the ugly line on the bottom left:
  ```bash
  sed -i .bak  's/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";background-color:#f3f3f3}/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";}/g' ${FILE}
  ```

[Grip installation](https://github.com/joeyespo/grip).

Also be warned that using grip without authentication (i.e. without a `--user ${GITHUB_USER_NAME}`) has a limit of about 60 requests per hour since grip will be using Github's API to generate the html. However, you can just provide the `${GITHUB_USER_NAME}` using that flag. Once you provide the corresponding github password, you will be allowed to generate up to 5000 requests per hour (https://developer.github.com/v3/#rate-limiting).

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
  # TODO: was the following due to not setting upstream?
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
