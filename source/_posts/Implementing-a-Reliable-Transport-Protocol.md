---
title: Implementing a Reliable Transport Protocol
abbrlink: 6693b937
date: 2019-11-13 22:13:23
tags:
---

Computer Networking:A Top-Down approach chapter 3 lab

<!-- more -->

------

在这次的实验当中，需要实现一个简单的可靠数据传输协议。(即比特交换协议版本与GBN版本)[这是实验的要求](http://media.pearsoncmg.com/aw/aw_kurose_network_3/labs/lab5/lab5.html)

## 比特交换协议(alternating bit protocol)

比特交换协议简单来说，就是对于每个包都使用0和1来标记，一个一个包的确认可靠数据的传输。具体的操作就如同书中的状态机的表达那样。

这个协议的最大的缺点就是，当当前包的ACK确认收到之前，都是不能进行任何的操作的，大大的浪费了带宽。

在这里，我使用一个int标记以及switch的方式来实现这个自动机。如同书中的状态机一样，发送方发送seq而接受方根据seq来回馈确认的ack，最后，发送方依靠ack来切换自己的等待状态，使自己进入新的wait_call状态


```c
#define ACK_0 0
#define ACK_1 1

#define SEQ_0 0
#define SEQ_1 1

#define SENDER_WAIE_CALLED_0 0
#define SENDER_WAIT_ACK_0 1
#define SENDER_WAIT_CALLED_1 2
#define SENDER_WAIT_ACK_1 3

#define TIMER_WAIT 5.0f

#define RECV_WAIT_0 0
#define RECV_WAIT_1 1

int sender_state;
struct pkt waitting_ack_pkt;

int recv_state;

int corrupt(struct pkt *pkt) {
  int sum = pkt->acknum + pkt->seqnum;
  for (int i = 0; i < 20; i++) {
    sum += (int)pkt->payload[i];
  }

  return sum != pkt->checksum;
}

void build_pkt(struct pkt *pkt, int ack, int seq, char *data) {
  pkt->seqnum = seq;
  pkt->acknum = ack;
  pkt->checksum = (pkt->seqnum + pkt->acknum);
  for (int i = 0; i < 20; i++) {
    pkt->payload[i] = data[i];
  }
  for (int i = 0; i < 20; i++) {
    pkt->checksum += (int)pkt->payload[i];
  }
}

/* called from layer 5, passed the data to be sent to other side */
A_output(message) struct msg message;
{
  struct pkt send_pkt;
  switch (sender_state) {
  case SENDER_WAIE_CALLED_0:
    build_pkt(&send_pkt, -1, SEQ_0, message.data);
    sender_state = SENDER_WAIT_ACK_0;
    break;
  case SENDER_WAIT_CALLED_1:
    build_pkt(&send_pkt, -1, SEQ_1, message.data);
    sender_state = SENDER_WAIT_ACK_1;
    break;
  default:
    return 0;
  }

  waitting_ack_pkt = send_pkt;
  tolayer3(0, send_pkt);
  starttimer(0, TIMER_WAIT);
}

B_output(message) /* need be completed only for extra credit */
    struct msg message;
{}

/* called from layer 3, when a packet arrives for layer 4 */
A_input(packet) struct pkt packet;
{
  int c = corrupt(&packet);
  if (c)
    return 0;

  switch (sender_state) {
  case SENDER_WAIT_ACK_0:
    if (packet.acknum == ACK_0) {
      stoptimer(0);
      sender_state = SENDER_WAIT_CALLED_1;
    }
    break;
  case SENDER_WAIT_ACK_1:
    if (packet.acknum == ACK_1) {
      stoptimer(0);
      sender_state = SENDER_WAIE_CALLED_0;
    }
    break;
  default:
    break;
  }
}

/* called when A's timer goes off */
A_timerinterrupt() {
  tolayer3(0, waitting_ack_pkt);
  starttimer(0, TIMER_WAIT);
}

/* the following routine will be called once (only) before any other */
/* entity A routines are called. You can use it to do any initialization */
A_init() { sender_state = SENDER_WAIE_CALLED_0; }

/* Note that with simplex transfer from a-to-B, there is no B_output() */

/* called from layer 3, when a packet arrives for layer 4 at B*/
B_input(packet) struct pkt packet;
{
  struct pkt recv_pkt;
  int c = corrupt(&packet);
  if (c) {
    build_pkt(&recv_pkt, recv_state == RECV_WAIT_0 ? ACK_1 : ACK_0, -1,
              packet.payload);
    tolayer3(1, recv_pkt);
    return -1;
  }

  switch (recv_state) {
  case RECV_WAIT_0:
    if (packet.seqnum == SEQ_0) {
      build_pkt(&recv_pkt, ACK_0, -1, packet.payload);
      tolayer3(1, recv_pkt);
      tolayer5(1, packet.payload);
      recv_state = RECV_WAIT_1;
    } else {
      build_pkt(&recv_pkt, ACK_1, -1, packet.payload);
      tolayer3(1, recv_pkt);
    }

    break;
  case RECV_WAIT_1:
    if (packet.seqnum == SEQ_1) {
      build_pkt(&recv_pkt, ACK_1, -1, packet.payload);
      tolayer3(1, recv_pkt);
      tolayer5(1, packet.payload);
      recv_state = RECV_WAIT_0;
    } else {
      build_pkt(&recv_pkt, ACK_0, -1, packet.payload);
      tolayer3(1, recv_pkt);
    }

    break;
  default:
    break;
  }
}

/* called when B's timer goes off */
B_timerinterrupt() {}

/* the following rouytine will be called once (only) before any other */
/* entity B routines are called. You can use it to do any initialization */
B_init() { recv_state = RECV_WAIT_0; }

```

## GBN(go back n)

GBN与比特交换协议相比，多了一个滑动窗口，这样，在窗口内，都可以发送包，而不必一定要等到相应的ack应答。这样做大大改进了比特交换协议的浪费带宽的缺点。

不过，GBN也有一个问题，那就是，当超时(丢包，拥塞发生时)就会重传所有以发送但是未确认的包。但是，其中有些包可能是乱序到达了，从而导致了链路资源的浪费。(这个问题在TCP有优秀的解决方法)

首先，我先指定了一个64大小的窗口，由于GBN协议是不需要接收方也维护一个接受窗口的，因此，只需要依靠接收方回复的ACK来确认以接受的包的位置。然后，根据课本上的状态机的图，以及，处理`ACK < base`,`base < ACK < nextSeqNum`,`ACK > nextSeqNum`的时候的操作，就可以了。

```c
#define N 64

#define WAIT_TIME 10.0f

struct pkt sndpkt[N];
int base,nextSeqNum;

int expectedSeqNum;

make_pkt(pkt,ack,seq,data) 
  struct pkt *pkt;int ack;int seq;char *data;
{
  pkt->acknum = ack;
  pkt->seqnum = seq;
  pkt->checksum = ack + seq;
  for(int i = 0;i < 20;i++)
  {
    pkt->payload[i] = data[i];
  }
  for(int i = 0;i < 20;i++)
  {
    pkt->checksum += (int)pkt->payload[i];
  }
}

corrupt(rcvpkt)struct pkt rcvpkt;
{
  int sum = rcvpkt.acknum + rcvpkt.seqnum;
  for(int i = 0;i < 20;i++)
  {
    sum += (int)rcvpkt.payload[i];
  }

  return sum != rcvpkt.checksum;
}

/* called from layer 5, passed the data to be sent to other side */
A_output(message)
  struct msg message;
{
  struct pkt send_pkt;
  if(nextSeqNum < base + N)
  {
    make_pkt(&send_pkt,0,nextSeqNum,message.data);
    sndpkt[nextSeqNum - base] = send_pkt;
    tolayer3(0,send_pkt);
    if(base == nextSeqNum)
    {
      starttimer(0,WAIT_TIME);
    }
    nextSeqNum++;
  }

}

B_output(message)  /* need be completed only for extra credit */
  struct msg message;
{
}

/* called from layer 3, when a packet arrives for layer 4 */
A_input(packet)
  struct pkt packet;
{
  if(corrupt(packet)) return 0;

  int newBase = packet.acknum + 1;
  if(newBase < base) return 0;

  if(newBase == nextSeqNum)
    stoptimer(0);
  else
  {
    stoptimer(0);
    starttimer(0,WAIT_TIME);
  }
  memmove(&sndpkt,&sndpkt[newBase - base],N - (newBase - base));
  base = newBase;
}

/* called when A's timer goes off */
A_timerinterrupt()
{
  starttimer(0,WAIT_TIME);
  for(int i = 0;i < nextSeqNum - base;i++)
  {
    tolayer3(0,sndpkt[i]);
  }
}  

/* the following routine will be called once (only) before any other */
/* entity A routines are called. You can use it to do any initialization */
A_init()
{
  base = 1;
  nextSeqNum = 1;
}


/* Note that with simplex transfer from a-to-B, there is no B_output() */

/* called from layer 3, when a packet arrives for layer 4 at B*/
B_input(packet)
  struct pkt packet;
{
  struct pkt ack_pkt;
  if(corrupt(packet) || packet.seqnum != expectedSeqNum)
  {
    make_pkt(&ack_pkt,expectedSeqNum - 1,0,packet.payload);
    tolayer3(1,ack_pkt);
    return 0;
  }

  
  make_pkt(&ack_pkt,expectedSeqNum,0,packet.payload);
  tolayer3(1,ack_pkt);
  tolayer5(1,packet.payload);
  expectedSeqNum++;
}

/* called when B's timer goes off */
B_timerinterrupt()
{
}

/* the following rouytine will be called once (only) before any other */
/* entity B routines are called. You can use it to do any initialization */
B_init()
{
  expectedSeqNum = 1;
}

```

## 总结

总的来说，这个LAB并不难，但是挺有趣的，让我更加好的理解了这些协议，同时也感受到了TCP协议的优秀。
