function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}
let myRequest = [];
let paramCount = 1;
let requestCount = 0;
function appendRequestInDocument(){
    if(myRequest.length != 0){
        let noItemFound = document.getElementById("noItemFound");
        noItemFound.innerHTML = '';

    }
    else{
        let myaddedReq = document.getElementById("myaddedReq");
        myaddedReq.innerHTML = '<h5 style = "color:#d7d7d7; margin-top:25px;" id="noItemFound"> No requests found! </h5>';
    }
}
function addRequest(url ,reqType , header , body){
    let div = document.createElement('div');
    requestCount++;
    let string = `<div id = "request-${requestCount}" class="request-container">
                    <span class = "${reqType}"> ${reqType} </span>
                    <span class = "apiUrl">${apiUrl}</span>
                    </div>`
    div.innerHTML = string;
    let myaddedReq = document.getElementById("myaddedReq");
    myaddedReq.appendChild(div.firstElementChild);
    document.getElementById(`request-${requestCount}`).addEventListener('click' , ()=>{
        console.log(document.getElementById(`request-${requestCount}`).innerHTML);
    })

}
appendRequestInDocument();
function showRequestHeader(){
    document.getElementById("request-header").style.display = "block";
    document.getElementById("request-body").style.display = "none";
    document.getElementById("request-header-label").className = "request-body-tabs active-tab";
    document.getElementById("request-body-label").className = "request-body-tabs";
}
function showRequestBody(){
    document.getElementById("request-body").style.display = "block";
    document.getElementById("request-header").style.display = "none";
    document.getElementById("request-body-label").className = "request-body-tabs active-tab";
    document.getElementById("request-header-label").className = "request-body-tabs";
}

function showProgressBar(){
    document.getElementById("progress-container").style.display = "block";
}
function hideProgressBar(){
    document.getElementById("progress-container").style.display = "none"; 
}

function changeTextColor(e) {
    switch (e.value) {
        case "GET":
            e.style.color = "green";
            document.getElementById("request-body-label").style.display = "none";
            showRequestHeader();
            break; 

            case "POST":
            case "PUT":
            e.style.color = "#b59601";
            break;

            case "DELETE":
            e.style.color = "red"; 
            break;
            
        default:
            break;
    }
    if(e.value != "get"){
        document.getElementById("request-body-label").style.display = "initial";
    }
}


{
    let jsonLabel = document.getElementById("paramJson-radio-label");
    let customParamlabel = document.getElementById("customparam-radio-label");
    let jsonParamDiv = document.getElementById("json-param-div");
    let custParamDiv = document.getElementById("custom-param-div");

    jsonLabel.addEventListener('click' ,()=>{
        custParamDiv.style.display = "none";
        jsonParamDiv.style.display = "initial";
    })
    customParamlabel.addEventListener('click' ,()=>{
        custParamDiv.style.display = "block";
        jsonParamDiv.style.display = "none";
    })
}
{
    let addBtn = document.getElementById("addCustomParam-btn");
    let paramContainer = document.getElementById("custom-param-div");
    addBtn.addEventListener('click' , ()=>{
        let str = `<div class="custom-parameter-container">
                        <input type="text" name="" id="custom-param-key-${paramCount+1}" placeholder="Enter key here">
                        <input type="text" name="" id="custom-param-value-${paramCount+1}" placeholder="Enter value here">
                        <button id="delCustomParam-btn" class = "delCustomParam-btn">-</button>
                    </div>`
        paramContainer.appendChild(getElementFromString(str));
        paramCount++;
        let deleteParam = document.getElementsByClassName("delCustomParam-btn");
        for(item of deleteParam){
            item.addEventListener('click' , (e)=>{
                e.target.parentElement.remove();
            })
        }
    })
}

//#####################################  HTTP Request  ###################################

function sendReq(){
    showProgressBar();
    document.getElementById("response-textarea").value = "Please wait..."
    const apiUrl = document.getElementById("req-url").value;
    const requestType = document.getElementById("requestType").value;
    if(requestType == "GET"){
        let x = getHeaderData();
        if(x.trim() == ''){
            
            callGet(apiUrl);
        }
        else{
            callGet(apiUrl , getHeaderData());
        }
    }
    else{
            callRest(apiUrl ,requestType, getHeaderData() , getBody());
    }
    hideProgressBar();
}
function callGet(apiUrl , header){
    if(header == undefined){
        header = {}
    }
    else{
        header = JSON.parse(header);
    }
    fetch(apiUrl,{
        method:'GET',
        headers: header
    })
    .then(response => response.text())
    .then((text)=>{
        document.getElementById("response-textarea").value = text;
    })
}
    function callRest(apiUrl , requestType ,  header , Body){
        Body = JSON.stringify(JSON.parse(Body));
        if(header == undefined){
            header = {}
        }
        else{
            header = JSON.parse(header);
        }
        // header['Content-Type'] = 'application/json';
        fetch(apiUrl,{
            method: requestType,
            headers: header,
            body: Body,
        })
        .then(response => response.text())
        .then((text)=>{
            document.getElementById("response-textarea").value = text;
        })
    }
function getHeaderData(){
    let paramType = document.querySelector("input[name = 'param-radio']:checked").value;
    let data;
    if(paramType == "json"){
        data = document.getElementById("json-param").value;
    }
    else{
        data = {};
        for(i =1; i<paramCount+1;i++){
            let key = document.getElementById(`custom-param-key-${i}`);
            if(key != undefined){
                key = key.value;
                let value = document.getElementById(`custom-param-value-${i}`).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    } 
    return data;
}

function getBody(){
    let reqBody = document.getElementById("request-body-textarea").value;
    return reqBody;
}

// ############################## BEAUTIFY #############################

let beautify = document.getElementById("beautify");
let tar = document.getElementById("response-textarea");
beautify.addEventListener('click' , ()=>{
    let JsonString = tar.value;
    const formattedJson = JSON.stringify(JSON.parse(JsonString),null,4);
    tar.value = formattedJson;
})  


// ############################## COPY ###################################
{
    let tar = document.getElementById("response-textarea");
    let copyBtn = document.getElementById("copy");
    copyBtn.addEventListener('click', ()=>{
        let copyText = document.createElement('textarea');
        document.body.appendChild(copyText);
        copyText.value = tar.value;
        copyText.select();

        document.execCommand('copy');
        document.body.removeChild(copyText);
    })
}


// ######################## SAVE ########################################

let saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener('click' , ()=>{
    {
        let apiUrl = document.getElementById("req-url").value;
        let requestType = document.getElementById("requestType").value;
        let body = getBody();
        let header = getHeaderData();
        const obj = new Object();
        requestCount++;
        obj.id = requestCount;
        obj.url = apiUrl;
        obj.reqType = requestType;
        obj.body = body;
        obj.head = header;

        myRequest.push(obj);

        console.log(myRequest);
    }
})

