document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userMap = {
      "mahmoud.kader": "Mr.Mahmoud",
        "fr.mohannd.hassen": "Mohand",
        "fr.julia.s.zaky": "Julia",
        "fr.minah.m.hssn": "Minah",
        "fr.fouadd.a.hsn": "Fouad",
        "fr.shahd.k.shebl": "Shahd"
    };

    const password = "Abcd12345@";
    const username = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    if (userMap[username] && enteredPassword === password) {
        localStorage.setItem('currentUser', userMap[username]);
        window.location.href = 'home.html';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
});