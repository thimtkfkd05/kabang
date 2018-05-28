function isSame(){
    var pw = document.getElementById("pw").value;
    var pwCk = document.getElementById("pwCheck").value;
    if(pw != '' && pwCk !=''){
        if(pw == pwCk){
            document.getElementById('same').innerHTML = 'Same';
            document.getElementById('same').style.color = 'green';
        }else{
            document.getElementById('same').innerHTML = 'Not Same';
            document.getElementById('same').style.color = 'red';
        }
    }
}
function Rcheckempty(){
    var em = document.getElementById("EM").value;
    var pw = document.getElementById("pw").value;
    var pwCK = document.getElementById("pwCheck").value;
    var NN = document.getElementById("NN").value;
    var PN = document.getElementById("PN").value;
    var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    if(em == ""){
        alert("Please input E-mail");
        return;
    }else if(pw == ""){
        alert("Please input Password");
        return;
    }else if(pwCK == ""){
        alert("Please input PasswordCheck");
        return;
    }else if(NN == ""){
        alert("Please input nickname");
        return;
    }else if(PN == ""){
        alert("Please input phone Number");
        return;
    }

    if(pw != pwCK){
        alert("password and passwordCheck are not same");
        return;
    }
    if(regex.test(em) === false) {  
    alert("Wrong E-mail format");
<<<<<<< HEAD
    return;
    }  
    alert("Register Success");
    window.location.href="loginpage";
=======
    exit; 
    } else {
        alert("Register Success");
        window.location.href="loginpage";
    }
>>>>>>> cde05cdd687fd993ac63ed4daf1c7b3e43d17e1b

}

function Scheckempty(){
    var em = document.getElementById("EM").value;
    var pw = document.getElementById("pw").value;
    var pwCK = document.getElementById("pwCheck").value;
    var NN = document.getElementById("NN").value;
    var PN = document.getElementById("PN").value;

    if(em == ""){
        alert("Please input E-mail");
        return;
    }else if(pw == ""){
        alert("Please input Password");
        return;
    }else if(pwCK == ""){
        alert("Please input PasswordCheck");
        return;
    }else if(NN == ""){
        alert("Please input nickname");
        return;
    }else if(PN == ""){
        alert("Please input phone Number");
        return;
    }
    
    if(pw != pwCK){
        alert("password and passwordCheck are not same");
        return;
    }
    alert("Please verify Kaist mail in 1 days");
    window.location.href="loginpage";
}