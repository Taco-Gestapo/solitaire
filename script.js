/*
              Game: Solitaire++
            Author: Neeraj Buccam
      Release Date: 31-Mar-2015
           Version: 3.0
  File Description: Javascript code built for SOLITAIRE++ 2015
*/
//  +++++++++++++++++++++++++  Initialization  +++++++++++++++++++++++++
        var stk1 = new Array(), stk2 = new Array(), stk3 = new Array(), stk4 = new Array(), stk5 = new Array(), stk6 = new Array(), stk7 = new Array();
//  top-left array stacks for EXTRA CARDS DECK
        var stkex_l = new Array(), stkex_r = new Array();
//  top-right array stacks for HOME CARDS DECK
        var stkh1 = new Array(), stkh2 = new Array(), stkh3 = new Array(), stkh4 = new Array();
//  Stack arrays for holding all cards and temperary cards
        var cards = new Array(), cards2 = new Array(), temp = new Array();
//  UNDO feature stack array and variables
        var undo = new Array(), poped, dbl_click_flag=0, prev_card_status=0, temp_len=0;
//  Card Object Variables
        var value, cardvalue, cardid, suit, color, image, status;
//  No of Cards placed in each stack after shuffling
        var s1=1, s2=2, s3=3, s4=4, s5=5, s6=6, s7=7, ex_l=24;
//  'dragself' stores dragged card
//  'divdrag' stores div of dragged card
//  'stackdrag_len' total cards in 'stackdrag' array
//  'divdrop' stores div on which dragged card id dropped
        var dragself, divdrag, divdrop, stackdrag=0, stackdrag_len, stackdrop=0;
//  'extra_size' is the total remaining cards in top-left EXTRA CARDS
//  'cardMoved' stores total moves made in game
//  'score' game score
//  'hour','min','sec' are game timer variables
//  'timer' stores the setinterval instance of game timer
//  'reset' flag for reset button
//  'cheat_chkd' checkbox element
//  'cheat_mode' flag store if cheat mode enabled or not
        var extra_size = 24, cardMoved=0, score=0, hour=0, min=0, sec=0, timer, reset=1, cheat_chkd=0, cheat_mode=0;
//  +++++++++++++++++++++++++  End of Initialization  +++++++++++++++++++++++++

//  +++++++++++++++++++++++++  Functions  +++++++++++++++++++++++++
//  Card Object Constructor function
    function card(value,j,cardid,suit,color,image,status){
        var value,suit,color,image,status;
            this.value = value;
            this.cardvalue = j;
            this.cardid = cardid;
            this.suit = suit;
            this.color = color;
            this.image = image;
            this.status = status;
    }
//  Shuffle cards
    function shuffle(){
        for(var i=0,j=0;i<52;i++){
            j = Math.floor((Math.random() * 52));
            if(!cards2[j])
                cards2[j] = cards[i];
            else
                --i;
        }
        for(var i=0;i<52;i++){
            cards[i] = cards2[i];
            cards[i].cardid = "card" + i;
        }
    }
//  Flip top card with animation on load
    function animate_card(crd,level,css){
        crd.className = "l"+level+" anim_"+css;
    }
//  Create Elements, Set & Position cards on the browser window
    function setCard(stk,limit,div_id,offset){
        var c,img,top,d;
            for(var i=0,j=offset;i<limit;i++,j++){
                c = document.getElementById(div_id);
                img = document.createElement("img");
                img.style.position = "absolute";
                d = document.createAttribute("draggable");
                if(div_id == "extra-l")
                    d.value = "false";
                else{
                    d.value = "true";
                    img.setAttributeNode(d);
                    d = document.createAttribute("ondragstart");
                    d.value = "drag(this)";
                }
                    img.setAttributeNode(d);
                if(limit != 24){
                    img.className = "l" + i;
                    animate_card(img,i,cards[j].cardid);
                }
                img.id = cards[j].cardid;
                img.src = "cards/closed.png";
                c.appendChild(img);
                stk.push(cards[j]);
                top = cards[j];
            }
            if(limit != 24){
                img.src = top.image;
                top.status = "open";
            }
        return i;
    }
//  Insert cards by calling 'setCard' function for each
function insertStkCard(){
    setCard(stk1,s1,"c1",0);
    setCard(stk2,s2,"c2",1);
    setCard(stk3,s3,"c3",3);
    setCard(stk4,s4,"c4",6);
    setCard(stk5,s5,"c5",10);
    setCard(stk6,s6,"c6",15);
    setCard(stk7,s7,"c7",21);
    setCard(stkex_l,ex_l,"extra-l",28);
}
//  Redraws div's and image's on the browser window
    function reDraw(){
        var tmp = new Array(stk1,stk2,stk3,stk4,stk5,stk6,stk7,stkex_l,stkex_r,stkh1,stkh2,stkh3,stkh4);
        var tmp2 = new Array("c1","c2","c3","c4","c5","c6","c7","extra-l","extra-r","h1","h2","h3","h4");
        var div,d,img;
            document.getElementById("move").innerHTML = cardMoved;
            document.getElementById("score").innerHTML = score;
            for(var i=0;i<tmp.length;i++){
                div = document.getElementById(tmp2[i]);
                div.innerHTML = "";
                for(var j=0;j<tmp[i].length;j++){
                    img = document.createElement("img");
                        img.style.position = "absolute";
                        d = document.createAttribute("draggable");
                        if(tmp2[i] == "extra-l")
                            d.value = "false";
                        else{
                            d.value = "true";
                            img.setAttributeNode(d);
                            d = document.createAttribute("ondragstart");
                            d.value = "drag(this)";
                        }
                        img.setAttributeNode(d);
                        if((tmp2[i] != "extra-l") && (tmp2[i] != "extra-r") && (tmp2[i] != "h1") && (tmp2[i] != "h2") && (tmp2[i] != "h3") && (tmp2[i] != "h4"))
                            img.className = "l" + (j);
                        if(tmp[i][j].status == "open")
                            img.src = (tmp[i][j].image);
                        else
                            img.src = "cards/closed.png";
                        img.id = tmp[i][j].cardid;
                    div.appendChild(img);
                }
            }
    }
//  Open EXTRA CARD in cycle from top-left array stack, update both stacks
    function openextra(self){
        var p,q,c,o,d;
            if(stkex_l.length > 0){
            p = stkex_l.pop();
                c = document.getElementById("extra-r");
                img = document.createElement("img");
                    img.style.position = "absolute";
                        d = document.createAttribute("draggable");
                        d.value = "true";
                    img.setAttributeNode(d);
                        d = document.createAttribute("ondragstart");
                        d.value = "drag(this)";
                    img.setAttributeNode(d);
                    img.id = self.lastChild.id;
                    img.src = p.image;
                    p.status = "open";
                c.appendChild(img);
            stkex_r.push(p);
            self.removeChild(self.lastChild);
            cardMoved++;
            reDraw();
            }
            else if(stkex_r.length >= extra_size){
                for(var i=0,j=0;i<extra_size;i++,j++){
                    p = stkex_r.pop();
                        o = document.getElementById("extra-r");
                        c = document.getElementById("extra-l");
                        img = document.createElement("img");
                            img.style.position = "absolute";
                                d = document.createAttribute("draggable");
                                d.value = "false";
                            img.setAttributeNode(d);
                                d = document.createAttribute("ondragstart");
                                d.value = "drag(this)";
                            img.setAttributeNode(d);
                            img.id = o.lastChild.id;
                            img.src = "cards/closed.png";
                            p.status = "closed";
                        c.appendChild(img);
                    stkex_l.push(p);
                    o.removeChild(o.lastChild);
                }
            }
    }
//  Returns the respective STAKE with input as DIV ID
	function getStack(self){
	    if(self.id == "c1")  return stk1;
	    else if(self.id == "c2")  return stk2;
	    else if(self.id == "c3")  return stk3;
	    else if(self.id == "c4")  return stk4;
	    else if(self.id == "c5")  return stk5;
	    else if(self.id == "c6")  return stk6;
	    else if(self.id == "c7")  return stk7;
	    else if(self.id == "extra-l")  return stkex_l;
	    else if(self.id == "extra-r")  return stkex_r;
	    else if(self.id == "h1")  return stkh1;
	    else if(self.id == "h2")  return stkh2;
	    else if(self.id == "h3")  return stkh3;
	    else if(self.id == "h4")  return stkh4;
	}
//  Adds card from one Stack to another Stack
    function pusher(stk1,stk2){
        while(undo.length != 0)
            undo.pop();
        poped = stk1.pop();
        stk2.push(poped);
        undo.push(poped);
        return 1;
    }
//  Inserts cards from temperary array to stakedrop array , function created to avoid code redendency
    function pushpop(){
        while(undo.length != 0)
            undo.pop();
        while(temp.length != 0){
            poped = temp.pop();
            stackdrop.push(poped);
            undo.push(poped);
        }
        cardMoved++;
        if((stackdrop == stkh1) || (stackdrop == stkh2) || (stackdrop == stkh3) || (stackdrop == stkh4))
            score = score + 10;
        else if((stackdrag == stkh1) || (stackdrag == stkh2) || (stackdrag == stkh3) || (stackdrag == stkh4))
            score = score - 12;
        else
            score = score - 2;
        return 1;
    }
//  Checks if the card move is valid or not
    function valid_Move(){
        var card_drag,card_drop,flag=0,stk;
            if(dbl_click_flag == 0)
                card_drop = stackdrop.pop();
            if(card_drop != null)
                stackdrop.push(card_drop);
            while(dragself != null){
                card_drag = stackdrag.pop();
                temp.push(card_drag);
                dragself = dragself.nextSibling;
            }
            temp_len = temp.length;
                if((stackdrag_len > 1) && (stackdrag.length != 0) && (stackdrag[stackdrag_len-temp_len-1].status == "open"))
                    prev_card_status = 1;
                else
                    prev_card_status = 0;
            cheat_mode == 1 ? stk = stackdrop : stk = stackdrag;
            if((stackdrop == stkh1) || (stackdrop == stkh2) || (stackdrop == stkh3) || (stackdrop == stkh4)){
                if(card_drop == null){
                    if(card_drag.cardvalue == 1)
                        flag = pushpop();
                    else
                        while(temp.length != 0)
                            pusher(temp,stackdrag);
                }
                else{
                    if((card_drag.suit == card_drop.suit) && (card_drag.cardvalue-1 == card_drop.cardvalue) && (temp.length == 1))
                        flag = pushpop();
                    else
                        while(temp.length != 0)
                            pusher(temp,stackdrag);
                }
            }
            else{
                if(card_drop == null){
                    if((card_drag.cardvalue == 13) || (cheat_mode == 1)){
                        flag = pushpop();
                        reDraw();
                    }
                    else
                        while(temp.length != 0)
                            pusher(temp,stk);
                }
                else if((card_drag.color != card_drop.color) && (card_drag.cardvalue == card_drop.cardvalue-1) && (stackdrop != stkex_r))
                    flag = pushpop();
                else{
                    while(temp.length != 0)
                        flag = pusher(temp,stk);
                        if((cheat_mode == 1) && (stackdrag != stackdrop))
                            score = score - 20;
                }
            }
            if((flag == 1) && (stackdrag == stkex_r))
                extra_size--;
            if((stackdrag.length > 0) && (stackdrop.length > 0)){
                stackdrag[stackdrag.length-1].status = "open";
                stackdrop[stackdrop.length-1].status = "open";
                divdrag.lastChild.src = stackdrag[stackdrag.length-1].image;
                if((card_drag.cardvalue != 13) && (card_drag.cardvalue != 1))
                    divdrop.lastChild.src = stackdrop[stackdrop.length-1].image;
            }
        if(cheat_mode == 1)
            cheatMove();
        reDraw();
    }
//  Check if the winning condition is met
    function chkWin(){
        if(stkh1.length + stkh2.length + stkh3.length + stkh4.length == 52){
            clearInterval(timer);
            alert("Congratulations! You Won. Party di :)");
        }
    }
//  this function is called when card is dragged
    function drag(self){
        dbl_click_flag=0;
        dragself = self;
        dup_dragself = self;
        divdrag = document.getElementById(self.id).parentNode;
        stackdrag = getStack(self.parentNode);
        stackdrag_len = stackdrag.length;
    }
//  overrides the default action of drag
    function dragAllow(e){
        e.preventDefault();
    }
//  this function is called when card is dropped on a div
    function drop(self){
        event.preventDefault();
        stackdrop = getStack(self);
        divdrop = document.getElementById(self.id);
        valid_Move();
        chkWin();
    }
//  UNDO move featured function, reverts a card move
    function undoMove(){
        if((undo.length != 0)){
            if(stackdrag == stkex_r)
                extra_size++;
            else{
                if(prev_card_status == 1)
                    stackdrag[stackdrag_len-temp_len-1].status = "open";
                else if(stackdrag_len != 1)
                    stackdrag[stackdrag_len-temp_len-1].status = "close";
            }
            for(var i=0;i < undo.length;i++)
                stackdrop.pop();
            while(undo.length != 0)
                temp.push(undo.pop());
            while(temp.length != 0)
                stackdrag.push(temp.pop());
            cardMoved++;
            if((stackdrop == stkh1) || (stackdrop == stkh2) || (stackdrop == stkh3) || (stackdrop == stkh4))
                score = score - 10 - 2;
            else
                score = score - 2;

        }
        reDraw();
    }
//  Animate card on double click
    function anim_dbl_click(crd,div){
    	var left, top;
    	first_flag=0;
    	keyframes=document.styleSheets[3];

    	crd.style.position = "relative";
    	div = document.getElementById(div);

    	left = div.offsetLeft;
    	top = div.offsetTop;
    	card_left = crd.offsetParent.offsetLeft;
    	card_top = crd.offsetParent.offsetTop;
    	card_left_new = -(card_left - left);
    	card_top_new = -(card_top - top);
	
    	keyframes.insertRule("@-webkit-keyframes "+crd.id+"crd_mov{ from { top: 0; left: 0; z-index: 100; } to { top: "+card_top_new+"; left: "+card_left_new+"; }}", 0);
    	crd.style.webkitAnimationName = crd.id+"crd_mov";

    	//keyframes.deleteRule(0);
    }
//  This function to moves card to HOME CARDS DECK if the move is valid
    function doubleClick(self){
        dbl_click_flag=1;
        stackdrag = getStack(self);
        var flag, divdrag, stkh1Empty=1, stkh2Empty=1, stkh3Empty=1, stkh4Empty=1;
        var dbl_click_card = stackdrag[stackdrag.length-1];
            if(stkh1.length > 0)
                stkh1Empty = 0;
            if(stkh2.length > 0)
                stkh2Empty = 0;
            if(stkh3.length > 0)
                stkh3Empty = 0;
            if(stkh4.length > 0)
                stkh4Empty = 0;
            if((stackdrag.length > 0) && (dbl_click_card.cardvalue == 1)){
                flag=1;
                if(stkh1.length == 0)
                    stackdrop = stkh1;
                else if(stkh2.length == 0)
                    stackdrop = stkh2;
                else if(stkh3.length == 0)
                    stackdrop = stkh3;
                else if(stkh4.length == 0)
                    stackdrop = stkh4;
                else
                    flag = 0;
            }
            else if(stackdrag.length > 0){
                flag=1;
                 if((stkh1Empty == 0) && (dbl_click_card.cardvalue == stkh1[stkh1.length-1].cardvalue+1) && (dbl_click_card.suit == stkh1[0].suit))
                    stackdrop = stkh1;
                 else if((stkh2Empty == 0) && (dbl_click_card.cardvalue == stkh2[stkh2.length-1].cardvalue+1) && (dbl_click_card.suit == stkh2[0].suit))
                    stackdrop = stkh2;
                 else if((stkh3Empty == 0) && (dbl_click_card.cardvalue == stkh3[stkh3.length-1].cardvalue+1) && (dbl_click_card.suit == stkh3[0].suit))
                    stackdrop = stkh3;
                 else if((stkh4Empty == 0) && (dbl_click_card.cardvalue == stkh4[stkh4.length-1].cardvalue+1) && (dbl_click_card.suit == stkh4[0].suit))
                    stackdrop = stkh4;
                 else
                    flag = 0;
            }
            if(flag == 1){
                temp_len=1;
                stackdrag_len = stackdrag.length;
                if((stackdrag_len > 1) && (stackdrag[stackdrag_len-1].status == "closed"))
                    prev_card_status = 1;
                else
                    prev_card_status = 0;
                pusher(stackdrag,stackdrop);
                cardMoved++;
                score = score + 10;
                if(stackdrag == stkex_r)
                    extra_size--;
                else if(stackdrag.length != 0){
                    stackdrag[stackdrag.length-1].status = "open";
                    //divdrag.lastChild.src = stackdrag[stackdrag.length-1].image;
                }
                reDraw();
                chkWin();
            }
    }
//  Auto Pilot Mode for moving cards automatically to the HOME AREA on mouse 'right click'
    function auto_Pilot(){
        event.preventDefault();
        var tmp = new Array(stk1,stk2,stk3,stk4,stk5,stk6,stk7,stkex_r);
        var tmp2 = new Array("c1","c2","c3","c4","c5","c6","c7","extra-r");
        var home = new Array(stkh1,stkh2,stkh3,stkh4);
        var last_card, home_last_card, divs, i=0, j=0, flag, flag_cnt=0, prev_deck_value=0;

        for(i=0;i < tmp.length;i++){
            if(tmp[i].length != 0){
                flag_cnt = 0;
                last_card = tmp[i][tmp[i].length - 1];
                for(j=0;j < home.length;j++){
                    if(home[j].length != 0){
                        home_last_card = home[j][home[j].length - 1];
                        if(last_card.color == "red")
                            flag = "black";
                        else
                            flag = "red";
                        if((home_last_card.color == flag) && ((home_last_card.cardvalue >= last_card.cardvalue-1) || home_last_card.cardvalue == 13)){
                            flag_cnt++;
                            flag = 1;
                        }
                        else
                            flag = 0;
                    }
                }
                flag_cnt == 2 ? flag = 1 : flag = 0;
                for(j=0;j < home.length;j++){
                    if(home[j].length != 0){
                        home_last_card = home[j][home[j].length - 1];
                        if((last_card.cardvalue == home_last_card.cardvalue + 1) && (last_card.suit == home_last_card.suit)){
                            if((flag == 1) && (flag_cnt == 2)){
                                div = document.getElementById(tmp2[i]);
                                doubleClick(div);
                                auto_Pilot();
                            }
                        }
                    }
                }
            }
        }
    }
//  Timer function
    function start_timer(){
        var time, H, M, S;
            time = document.getElementById("time");
            sec++;
            if(sec > 59){
                sec=0;
                min++;
            }
            else if(min > 59){
                sec=0;
                min=0;
                hour++;
            }
            H = (hour < 10) ? "0"+hour : hour;
            M = (min < 10) ? "0"+min : min;
            S = (sec < 10) ? "0"+sec : sec;
            time.innerHTML = H+":"+M+":"+S;
    }
//  Close all cards
    function closeCards(stk){
        while(stk.length != 0){
            stk[stk.length-1].status = "closed";
            stk.pop();
        }
    }
//  Resets the same instance of game and rearange the cards
    function resetGame(){
        closeCards(stk1);
        closeCards(stk2);
        closeCards(stk3);
        closeCards(stk4);
        closeCards(stk5);
        closeCards(stk6);
        closeCards(stk7);
        closeCards(stkh1);
        closeCards(stkh2);
        closeCards(stkh3);
        closeCards(stkh4);
        closeCards(stkex_l);
        closeCards(stkex_r);
        undo.length=0;
        if(reset == 1)
            insertStkCard();
        cardMoved=0, score=0, sec=0, min=0, hour=0;
        reset=1;
        reDraw();
    }
//  Creates new Game
    function newGame(){
        cards.length=0;
        cards2.length=0;
        reset = 0;
        clearInterval(timer);
        resetGame();
        start();
    }
//  Cheat Move function enables player to make a invalid move
    function cheatMove(){
        cheat_chkd = document.getElementById("chkCheat");
        cheat_chkd.checked == false ? cheat_chkd.checked = true : cheat_chkd.checked = false;
        cheat_chkd.checked == true ? cheat_mode = 1 : cheat_mode = 0;
    }
//  Display Rules & Features
    function help(){
        var help;
        help = document.getElementById("help");
        if(help.style.display == "block")
            help.style.display = "none";
        else
            help.style.display = "block";
    }
//  Main function, is called when HTML BODY loads
    function start(){
        for(var i=0,j=1;i<52;i++,j++){
            value = i;
            if(j > 13) j=1;

            if(i >= 0 && i < 13) suit = "spade";
            else if( i >= 13 &&  i < 26) suit = "heart";
            else if(i >= 26 &&  i < 39) suit = "diamond";
            else if(i >= 39 &&  i < 52) suit = "club";

            if((suit == "heart") || (suit == "diamond")) color = "red";
            else color = "black";

            image = "cards/" + suit + "/" + j + ".png";
            status = "closed";
            cards[i] = new card(value,j,cardid,suit,color,image,status);
        }
    shuffle();
    insertStkCard();
    timer = setInterval(function(){start_timer()}, 1000);
    }
//  +++++++++++++++++++++++++  End of Functions  +++++++++++++++++++++++++