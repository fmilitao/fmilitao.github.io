---
layout: default
minititle: Notes
---

1. [Git](#git)
2. [Docker](#docker)
3. [Generating HTML from Github flavored Markdown](#generating-html-from-github-flavored-markdown)
4. [Bash](#bash)
5. [AFS on MacOS](#afs-on-macos)
6. [Other](#other)


# Git

These generally work best if you have already set [your custom editor](http://stackoverflow.com/questions/2596805/how-do-i-make-git-use-the-editor-of-my-choice-for-commits).

* Edit last commit message ([source](http://stackoverflow.com/questions/179123/edit-an-incorrect-commit-message-in-git)):

  ```bash
  git commit --amend
  ```

* Edit last N commits or even squash them together ([source](http://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git)):

  ```bash
  # for where COMMIT_ID is the parent of the last commit to edit
  git rebase -i ${COMMIT_ID}
  # for previous 5 commits
  git rebase -i HEAD~5
  ```

  You can get the `${COMMIT_ID}` by looking at the `git log` (or `git log --graph` for easier way to see merges).

* [Git stashing](https://git-scm.com/book/en/v1/Git-Tools-Stashing) to save changes, without committing (and check other branches, etc.):

  ```bash
  # to stash changes
  git stash
  ... # stuff you need to do on other branches, for instance
  # to apply last stashed change
  git stash pop
  ```

* Hard reset (i.e. **LOSING ALL LOCAL CHANGES** unless you stash them first) to fix diverged branch. Specially useful if someone force pushed their changes. ([source](http://stackoverflow.com/questions/2452226/master-branch-and-origin-master-have-diverged-how-to-undiverge-branches), [source](http://stackoverflow.com/questions/4157189/git-pull-while-ignoring-local-changes)):

  ```bash
  git reset --hard ${BRANCH}
  # if necessary:
  git pull
  ```

* Pushing local branches to origin while also setting upstream ([source](http://stackoverflow.com/questions/6089294/why-do-i-need-to-do-set-upstream-all-the-time)):

  ```bash
  git push -u origin ${BRANCH}
  ```

* Checkout files from specific branches ([source](http://nicolasgallagher.com/git-checkout-specific-files-from-another-branch/)):

  ```bash
  git checkout ${BRANCH} -- ${PATH_TO_FILE}
  ```

* Keep theirs/ours version of files in merge conflicts ([source](http://gitready.com/advanced/2009/02/25/keep-either-file-in-merge-conflicts.html)):

  ```bash
  # uses version we have
  git checkout --ours ${FILE}
  # uses version to be merged in
  git checkout --theirs ${FILE}
  ```

* Ensure `upstream` points to correct URL, i.e. original owner ([source](https://help.github.com/articles/configuring-a-remote-for-a-fork/)):

  ```bash
  git remote -v #lists remotes, if no 'upstream' then add manually:
  git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
  ```

* Fetch and merge, push to origin ([source](https://help.github.com/articles/syncing-a-fork/)):

  ```bash
  git fetch upstream
  git checkout master
  git merge upstream/master
  git push origin
  ```

* Delete remote branch ([source](http://stackoverflow.com/questions/2003505/how-to-delete-a-git-branch-both-locally-and-remotely)):

  ```bash
  git push origin --delete ${BRANCH_NAME}
  # and on other machines you should do:
  git fetch --all --prune
  ```

* Fetch and prune remotes that were deleted:

  ```bash
  git fetch --all --prune --tags
  ```

* Update github pages branch of a project ([source](http://lea.verou.me/2011/10/easily-keep-gh-pages-in-sync-with-master/)):

  ```bash
  git checkout gh-pages
  # make sure your upstream is set and up-to-date
  git rebase master
  git push origin gh-pages
  ```

  Then return to your work branch.

* Remote branches look out:

  ```bash
  # counts
  git for-each-ref refs/remotes/ --format='%(committername)' | sort | uniq -c | sort -nr
  # only those that are yours
  git for-each-ref --sort=committerdate refs/remotes/ --format='%(committername) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) -  (%(color:green)%(committerdate:relative)%(color:reset))' | grep <your name>
  ```

* Useful `.gitconfig` options (suggested by [Diogo Sousa](https://github.com/orium)):

  ```
  [push]
    default = simple
  [alias]
    st = status
    ci = commit
    br = branch
    co = checkout
    unstage = reset HEAD --
    uncommit = reset --soft HEAD^ --
    last = log -1 HEAD --stat
    fmerge = merge --no-ff
    di = diff --patience
    gr = grep --break --heading --line-number
    lg = log --date=short --format='%C(yellow)%h%Creset %C(cyan)%<(16,trunc)%an%Creset %C(green)%ad%Creset %s%C(red)%d%Creset'
    uplg = !git fetch --quiet && git lg HEAD...@{u}
    uplog = !git fetch --quiet && git log HEAD...@{u}
    tags = !git log --tags --no-walk --reverse --date=short --format='%C(cyan)%<(24,trunc)%an%Creset %C(green)%ad%Creset %C(red)%D%Creset' | sed 's/tag: //g'
    tree = !git lg --graph --all
    # delete remote branch
    delrembr = push origin --delete
    dit = difftool -d
    milton = push -f
    # list all branches last commit author
    branches = !git branch -a | xargs -n1 git log -n1 --date=short --format='%C(cyan)%<(16,trunc)%an%Creset %C(green)%ad%Creset %D' 2>/dev/null | sort | uniq
    resetsm = !git submodule foreach git submodule init && git submodule update --recursive
  [branch "master"]
  [core]
    pager = less -F -X
  [color]
    ui = true
  [grep]
    lineNumber = true
    extendRegexp = true
  [diff]
    renames = copy
    renameLimit = 5000
  [gc]
    auto = 1024
  [log]
    decorate = short
  [color "diff"]
  [pull]
    ff = only
  [merge]
    tool = meld
  [rerere]
    enabled = true
  ```

# Docker

* [Get bash or ssh into running container](http://askubuntu.com/questions/505506/how-to-get-bash-or-ssh-into-a-running-container-in-background-mode):

  ```bash
  $ sudo docker exec -i -t ${CONTAINER_ID} bash
  # or
  $ sudo docker exec -i -t ${CONTAINER_NAME} bash
  ```

* Name the container using the `--name ${CONTAINER_NAME}` flag when running (auto-gen names are usually cool, though).

* Get a running container's ip address ([source](http://stackoverflow.com/questions/17157721/getting-a-docker-containers-ip-address-from-the-host)):

  ```bash
  docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${CONTAINER_ID}
  ```

* [Docker cheat sheet](https://github.com/wsargent/docker-cheat-sheet).

# Generating HTML from Github flavored Markdown

* For listening to changes (launches local http server, auto-refreshes on MARKDOWN_FILE changes, opens browser):

  ```bash
  grip --wide --title="Random Notes" --user-content -b ${MARKDOWN_FILE}
  ```

* For generating standalone html file:

  ```bash
  grip --wide --title="Random Notes" --user-content --export ${MARKDOWN_FILE}
  ```

* To clean up the ugly line on the bottom left:

  ```bash
  sed -i .bak  's/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";background-color:#f3f3f3}/.discussion-timeline::before{position:absolute;top:0;bottom:0;left:79px;z-index:-1;display:block;width:2px;content:"";}/g' ${HTML_FILE}
  ```

[Grip installation](https://github.com/joeyespo/grip).

Be warned that using grip without authentication (i.e. without a `--user ${GITHUB_USER_NAME}`) has a limit of about 60 requests per hour since grip will be using Github's API to generate the html. However, you can just provide the `${GITHUB_USER_NAME}` using the `user` flag. Once you provide the corresponding github password, you will be allowed to generate up to [5000 requests per hour](https://developer.github.com/v3/#rate-limiting).

# Bash

* [Bash string operators](http://sookocheff.com/post/bash/bash-string-operators/)

* Disk usage:

  ```bash
  # disk usage
  du -h -d 1 *
  ```

* Capture groups in sed:

  ```bash
  # use capture groups in sed
  sed -e 's/.*"id":\([0-9]\{1,15\}\).*"type":"\([a-zA-Z]\{1,10\}\).*/\1 \2/g' ${FILE}
  ```

* Show current time in terminal prompt by adding the line to `.bash_profile` (for mac terminals):

  ```bash
  export PS1="\t$ "
  ```

* Latexmk alias ([source](http://jon.smajda.com/2008/03/08/latexmk/)). Add line to `.bash_profile`:

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

# AFS on MacOS

Follow the steps ([source](http://www.cs.cmu.edu/~help/afs/afs_authentication.html)):

  * Authentication:

    ```bash
    kinit <username>@CS.CMU.EDU
    aklog cs.cmu.edu -k CS.CMU.EDU
    ```

    Should have `tokens`.

  * When done `unlog`.

# Other

* [LiveJS](http://livejs.com/) to have pages auto-reload when web developing.
