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

    if (pw != pwCK) {
        alert("password and passwordCheck are not same");
        return;
    }
    if (regex.test(em) === false) {  
        alert("Wrong E-mail format");
        return;
    } else {
        alert("Register Success");
        $.post('/auth/signup', {
            email: em,
            password: pw,
            name: NN,
            type: 'room_owner'
        }, function(signup_result) {
            if (signup_result.err || !signup_result.result) {
                alert("Register Failed. Try Again.");
            } else {
                alert("Register Success");
                window.location.href="/login";
            }
        });
    }
}

function sendVerification(){
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
    }else if(pw != pwCK){
        alert("password and passwordCheck are not same");
        return;
    }else {
        em = em += '@kaist.ac.kr';
        $.post('/auth/signup', {
            email: em,
            password: pw,
            name: NN,
            type: 'student'
        }, function(signup_result) {
            if (signup_result.err || !signup_result.result) {
                alert("Register Failed. Try Again.");
            } else {
                $.post('/auth/send_verification', {
                    user_id: signup_result.user_id,
                    user_email: em
                }, function(send_result) {
                    if (send_result.err || !send_result.result) {
                        alert("Send Verification Failed. Try Again.");
                    } else {
                        alert("Please verify Kaist mail in 1 days");
                    }
                });
            }
        });
    }
}