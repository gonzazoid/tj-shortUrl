// ==UserScript==
// @name         urls shortener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        *
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let x = 0;
    let y = 0;
    let url = '';
    const serviceUrl = 'https://127.0.0.1:3000';

    const ERR = {err: 'unknown'};

    const makeUrl = function(short){
        return `${serviceUrl}/${short}`;
    };

    const getElement = document.getElementById.bind(document);

    const reset = function(){
        cleanShortUrl();
        cleanErrMsg();
        cleanUserInput();
        cleanList();
    };

    const getShortUrl = async function(url){
        const body = JSON.stringify({full: url});
        try{
            const response = await fetch(`${serviceUrl}/addUrl`, {method: 'post', headers: {'Content-Type': 'application/json'}, body, credentials: 'include'});
            if(response.ok){
                return await response.json();
            }else{
                return ERR;
            }
        }catch(e){
            return ERR;
        }
    };

    const saveShortUrl = async function(payload){
        const body = JSON.stringify(payload);
        try{
            const response = await fetch(`${serviceUrl}/addUrl`, {method: 'post', headers: {'Content-Type': 'application/json'}, body, credentials: 'include'});
            if(response.ok){
                const status = response.json();
                return status;
            }else{
                return ERR;
            }
        }catch(e){
            return ERR;
        }
    };

    const getAllUrls = async function(){
        try{
            const response = await fetch(`${serviceUrl}/getAllUrls`, {method: 'post', headers: {'Content-Type': 'application/json'}, credentials: 'include'});
            if(response.ok){
                const list = await response.json();
                return list;
            }else{
                // TODO error handling;
            }
        }catch(e){
            // TODO error handling;;
        }
    };

    const cleanDomElement = function(elem){
        let child = elem.lastElementChild;
        while (child) {
            elem.removeChild(child);
            child = elem.lastElementChild;
        }
    };

    const getListComponent = function(list){
        const container = document.createElement('div');
        list.forEach(link => {
            const a = document.createElement('a');
            const url = makeUrl(link.short);
            a.href = url;
            a.innerHTML = link.short;
            container.appendChild(a);
            container.appendChild(document.createElement('br'));
        });
        return container;
    };

    const hasUserInput = function(){
        const input = getElement(`${id}_usersShortUrl`);
        return input.value !== '';
    };

    const getUserInput = function(){
        const input = getElement(`${id}_usersShortUrl`);
        return input.value;
    };

    const showShortUrl = function(url){
        const link = getElement(`${id}_shortUrl`);
        link.href = url;
        link.innerHTML = url;
    };

    const cleanShortUrl = function(){
        const link = getElement(`${id}_shortUrl`);
        link.href = '';
        link.innerHTML = '';
    }

    const cleanErrMsg = function(){
        const holder = getElement(`${id}_err`);
        holder.innerHTML = '';
    };

    const cleanUserInput = function(){
        const holder = getElement(`${id}_usersShortUrl`);
        holder.value = '';
    };

    const showError = function(errMsg){
        const errHolder = getElement(`${id}_err`);
        errHolder.innerHTML = errMsg;
    };

    const cleanList = function(){
        const container = getElement(`${id}_urlsList`);
        cleanDomElement(container);
    };

    const onSubmit = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        cleanShortUrl();
        cleanErrMsg();
        if(hasUserInput()){
            const short = getUserInput();
            const result = await saveShortUrl({short, full:url})
            if(result.err){
                showError(result.err);
            }else{
                showShortUrl(makeUrl(short));
                cleanUserInput();
            }
        }else{
            const result = await getShortUrl(url);
            console.log('SHORT!!!', result);
            if(result.err){
                showError(result.err);
            }else{
                showShortUrl(makeUrl(result.short));
            }
        }
    };

    const onGetAll = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const list = await getAllUrls();
        const component = getListComponent(list);
        const container = getElement(`${id}_urlsList`);
        cleanDomElement(container);
        container.appendChild(component);
    };

    const onMouseOver = (evt) => {
        console.log('FOCUS!!!!', evt);
        if(!evt.target.href){
            return;
        }

        modal.style.position='fixed';
        modal.style.zIndex = 99999;
        x = evt.clientX+2;
        y = evt.clientY+2;
        modal.style.left = `${x}px`;
        modal.style.top = `${y}px`;

        getElement(`${id}_url`).innerHTML = evt.target.href;
        url = evt.target.href;
        reset();
        modal.style.display = 'block';
    };

    const onMouseOut = (evt) => {
        evt.stopPropagation();
        if(evt.clientX - x <= 3 || evt.clientY - y <= 3){
            evt.target.removeEventListener(onMouseOut);
        }else{
            modal.style.display = 'none';
        }
    };

    const onModalBlur = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        modal.style.display = 'none';
    };

    const links = document.getElementsByTagName('a');
    Array.from(links).forEach(link => {
        link.addEventListener('mouseover', onMouseOver);
        link.addEventListener('mouseout', onMouseOut);
    });

    const id = `${Date.now()}`;
    const modal = document.createElement('div');
    modal.id = id;
    modal.innerHTML = `
        <div style="border: 1px solid grey; padding: 3px; border-radius: 3px; display: flex; align-items: stretch;">
          <div>
            <div style=""><a href='' id=${id + "_closeModal"}>X</a></div>
            <span id=${id + "_url"}></span>
            <br /></br />
            <input id=${id + "_usersShortUrl"} type="text" size="40" placeholder="you can type here your own abbreviation"><br />
            <input id=${id + "_getShortUrl"} type="button" value="get short url" /><a id=${id+"_shortUrl"} href=""></a>
            <span style="color: red;" id=${id+"_err"}></span>
            <br /></br />
            <input id=${id + "_getAllUrls"} type="button" value="show my urls" />
          </div>
          <div id=${id + "_urlsList"} style="overflow: scroll; height: 200px; margin: 7px;"></div>
        </div>
    `;
    modal.style.display = 'none';
    modal.style.background = 'white';

    document.body.appendChild(modal);
    getElement(`${id}_getShortUrl`).addEventListener('click', onSubmit);
    getElement(`${id}_getAllUrls`).addEventListener('click', onGetAll);
    getElement(`${id}_closeModal`).addEventListener('click', onModalBlur);
})();