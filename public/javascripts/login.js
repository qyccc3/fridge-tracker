function checkUserCredential(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    $.ajax({
        url: '/login',
        method: 'POST',
        data: {
            username: username,
            password: password
        },
        datatype: 'json',
        success: function(){
            window.location.href = '/';
        },
        error: function(){
            alert('Invalid username or password');
        }
    })
}