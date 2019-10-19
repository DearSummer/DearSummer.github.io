---
title: 'csapp:shlab'
tags:
  - csapp
abbrlink: cf79a2fc
date: 2019-10-19 00:11:29
---

shalab是csapp第八章，异常控制流的实验。

<!-- more -->

------

> [csapp:lab](http://csapp.cs.cmu.edu/3e/labs.html)

## 关于SHLAB

在这里，最重要的是实现这个shell的思路。

和书上说的一样，首先shell需要拥有两个功能，一个是内置的命令，另一个则是需要启动其他的程序。

内置的命令需要在shell自己的进程当中实现，而启动其他程序则是需要使用fork去产生新的子进程，然后，再使用exevc去替代子进程的内容，从而成功的执行其他程序。

而运行的其他程序的时候，最多只允许一个进程是运行在前台的，其他进程都只能够在后台运行。

于是，我们可以大致的得出这个shell的流程。

{% asset_img shlab_1.png %}

有了这个大概的思路，那么，最开始的eval就可以实现了。

剩下的就可以，也可以一边分析，一边进行实现了。

### eval(char *cmdline)

按照shell的思路，那么，大致的操作也就出来了。

```c
void eval(char *cmdline) 
{
    //step1: 解析字符串
    pid_t pid;

    char* argv[MAXLINE];
    char buf[MAXLINE];
    
    strcpy(buf,cmdline);
    int bg = parseline(buf,argv);

    if(argv[0] == NULL)
        return;
    
    //step2: 根据是否为内置命令进行不同的操作
    if(!builtin_cmd(argv))
    {
       sigset_t mask_all,mask_one,mask_prev;
       sigfillset(&mask_all);
       sigemptyset(&mask_one);
       sigaddset(&mask_one,SIGCHLD);

       sigprocmask(SIG_BLOCK,&mask_one,&mask_prev);
       
       if((pid = fork()) == 0)
       {
           sigprocmask(SIG_SETMASK,&mask_prev,NULL);
           setpgid(0,0);
           if(execve(argv[0],argv,environ) < 0)
           {
               unix_error(argv[0]);
               _exit(1);
           }
       }

        sigprocmask(SIG_BLOCK,&mask_all,NULL);
        addjob(jobs,pid,bg ? BG : FG,buf);
        sigprocmask(SIG_SETMASK,&mask_prev,NULL);

       
        sigprocmask(SIG_BLOCK,&mask_one,&mask_prev);
        if(!bg)
        {
            waitfg(pid);           
        }
        else
        {
            printf("[%d] (%d) %s",pid2jid(pid),pid,cmdline);
        }
        
        sigprocmask(SIG_SETMASK,&mask_prev,NULL);

        

    }
    return;
}
```
这里还有一点比较在重要的，因为jobs是全局变量，而且，还是会在子进程进行修改的局变量，因此，在修改，访问jobs的时候，一定要先将信号锁上，免得出现一些奇怪的问题。

还有一点就是，在fork新进程，在execve之前，需要对子进程进行分组，确保一个进程一个组。因为这样可以使得父进程接受到的信号不影响到子进程。

### builtin_cmd(char **argv)

按照步骤，第二步就是对内置命令进行处理了。

内置命令一共有4个，分别是quit,bg < jobs >,fg < jobs >,jobs,这个时候就要按照功能分别对其进行处理了。

首先是quit，这个是退出，没得说，直接exit(0)就可以了。子进程回收什么的在父进程终结之后，会由init进程处理的。

然后是bg和fg，这个因为在lab也是给了需要实现的函数，因此，在实现的时候再详解。

最后是jobs，这个直接调用listjobs就可以了。
```c
int builtin_cmd(char **argv) 
{
    if(strcmp(argv[0],"quit") == 0)
         exit(0);

    if(strcmp(argv[0],"jobs") == 0)
        {
            sigset_t mask_all,prev;
            sigfillset(&mask_all);
            sigprocmask(SIG_BLOCK,&mask_all,&prev);
            listjobs(jobs);
            sigprocmask(SIG_SETMASK,&prev,NULL);
            return 1;
        }
    
    if(strcmp(argv[0],"bg") == 0 || 
        strcmp(argv[0],"fg") == 0)
        {
            do_bgfg(argv);
            return 1;
        }



    return 0;     /* not a builtin command */
}

```

### do_bgfg(char **argv)

同样，按照要求解析字符串，命令只有两个，数量不对的都丢弃。(报错提示就按照tshref里面的照抄就可以了)

然后，根据是否有%符号去判断得到的是job的组号还是pid，然后，根据pid/jid去jobs当中寻找目标job。

若找到的话，根据bg/fg的命令去将进程重启(发送SIGCONT信号)，bg就直接后台启动，fg就阻塞父进程从而达到前台运行的效果。

若没找到，按照tshref里的内容输出错误提示就可以了。

```c
void do_bgfg(char **argv) 
{
    if(argv[2] != NULL)
        return;

    pid_t pid;
    struct job_t *job;
    char *command = argv[1];
    if(command == NULL)
    {
        if(strcmp(argv[0],"bg") == 0)
        {
            printf("bg: argument must be a PID or %%jobid\n");
        }
        else
        {
            printf("fg: argument must be a PID or %%jobid\n");
        }
        
        return;
    }

    sigset_t mask_all,mask_prev;
    sigfillset(&mask_all);

    sigprocmask(SIG_BLOCK,&mask_all,&mask_prev);

    if(command[0] == '%')
    {
        int jid = atoi(&command[1]);
        job = getjobjid(jobs,jid);
        if(job == NULL)
        {
            sigprocmask(SIG_SETMASK,&mask_prev,NULL);
            printf("%%%d: No such job\n",jid);
            return;
        }
            
        pid = job->pid;
    }
    else
    {
        pid = atoi(command);
        job= getjobpid(jobs,pid);
        if(job == NULL)
        {
            sigprocmask(SIG_SETMASK,&mask_prev,NULL);
            printf("(%d): No such process\n",pid);
            return;
        }
            
    }

    if(strcmp(argv[0],"bg") == 0)
    {
        kill(-pid,SIGCONT);
        job->state = BG;
        printf("[%d] (%d) %s",job->jid,job->pid,job->cmdline);
    }
    else
    {
        kill(-pid,SIGCONT);
        job->state = FG;
        waitfg(pid);
    }
    
    sigprocmask(SIG_SETMASK,&mask_prev,NULL);
    
}
```

### waitfg(pid_t pid)

下一个就是阻塞父进程的操作了，这个和书上的一样，先设置一个原子操作的全局变量，使得能够标记前台程序是否被操作完成，操作完成之后，将被挂起的父进程恢复

```c
volatile sig_atomic_t fg_proc_running = 0;
void waitfg(pid_t pid)
{
    sigset_t mask;
    sigemptyset(&mask);

    fg_proc_running = 1;
    while(fg_proc_running)
        sigsuspend(&mask);


    return;
}
```

### sigchld_handler(int sig)

之后就是那几个重要的信号处理程序了。

首先就是SIGCHLD信号的程序。

这个信号是当子进程结束或者被挂起的时候会发送的。在这里，自然也其了一个很关键的作用。

首先，就是当这个信号被触发的时候，先检查一下是什么原因被触发的。若是因为程序完成，或者是因为信号的原因而被终止的话，就应该删除其在jobs当中的记录，若是被暂停了，就要将其记录在jobs当中转换为暂停。

当然，无论是因为什么原因，若这个进程是前台进程，那么他都不应该继续是前台运行了，需要取消对父进程的阻塞，这点，将全局变量修改一下就可以做到了。

当然，在操作的时候要打印出来的信息按照tshref那样打印就可以了。

```c
void sigchld_handler(int sig) 
{
    int oldErrno = errno;
    int status;
    sigset_t mask_all,prev_all;
    pid_t pid;
    int jid;
    sigfillset(&mask_all);

    while((pid = waitpid(-1,&status,WNOHANG | WUNTRACED)) > 0)
    {     
        printf("reaped child process\n");
        sigprocmask(SIG_BLOCK,&mask_all,&prev_all);
        jid = pid2jid(pid);

        if(fgpid(jobs) == pid)
            fg_proc_running = 0;

        if(WIFEXITED(status))
        {
            deletejob(jobs,pid);

            if(verbose)
                printf("sigchld_handler:JOBS[%d] (%d) terminate (status:%d)\n",jid,pid,status);
        }

        if(WIFSIGNALED(status))
        {
            deletejob(jobs,pid);
            printf("Job [%d] (%d) terminated by signal %d\n",jid,pid,WTERMSIG(status));
            if(verbose)
               printf("sigchld_handler:JOBS[%d] (%d) terminate by signal:%d\n",jid,pid,WTERMSIG(status));
        }

        

        if(WIFSTOPPED(status))
        {
            getjobpid(jobs,pid)->state = ST;
            printf("Job [%d] (%d) stopped by signal %d\n",jid,pid,WSTOPSIG(status));
            if(verbose)
                printf("sigchld_handler:JOBS[%d] (%d) stopped by signal:%d\n",jid,pid,WSTOPSIG(status));
        }

        

        sigprocmask(SIG_SETMASK,&prev_all,NULL);
        
    }
    

    errno = oldErrno;
}
```

### sigint_handler(int sig)

当接受到INT指令的时候，需要将前台进程中断，从jobs当中找到前台进程的pid，然后，发送SIGINT给他的进程组就可以了。剩下的会在SIGCHLD当中处理

```c
void sigint_handler(int sig) 
{
    sigset_t mask_all,mask_prev;
    sigfillset(&mask_all);
    sigprocmask(SIG_BLOCK,&mask_all,&mask_prev);
    int pid = fgpid(jobs);
    kill(-pid,SIGINT);

    sigprocmask(SIG_SETMASK,&mask_prev,NULL);
}

```

### sigtstp_handler(int sig)

这个和SIGINT是一个道理的
```c
void sigtstp_handler(int sig) 
{
    sigset_t mask_all,mask_prev;
    sigfillset(&mask_all);
    sigprocmask(SIG_BLOCK,&mask_all,&mask_prev);
    int pid = fgpid(jobs);
    kill(-pid,SIGTSTP);

    sigprocmask(SIG_SETMASK,&mask_prev,NULL);
    return;
}
```

## 总结

分开实现之后，就可以很快实现了shlab的实验了。

其实这里大部分代码在书上都能找到痕迹。
